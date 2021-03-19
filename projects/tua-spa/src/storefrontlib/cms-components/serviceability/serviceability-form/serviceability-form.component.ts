import { TmaProduct } from '../../../../core/model/tma-product.model';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  OnDestroy,
  Input,
  AfterViewChecked,
  AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Country,
  Region,
  BaseSiteService,
  ProductService,
  User,
  UserService
} from '@spartacus/core';
import { ModalService } from '@spartacus/storefront';
import {
  GeographicAddress,
  TmaInstallationAddress,
  QueryServiceQualificationService
} from '../../../../core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TmaAddressFormComponent } from '../../address-form';
import { take, takeUntil, filter, first } from 'rxjs/operators';
import {
  QueryServiceQualification,
  GeographicAddressService,
  TmaPlace,
  TmaTmfRelatedParty
} from '../../../../core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductDetailsDialogComponent } from '../../product/product-details-dialog/product-details-dialog.component';


@Component({
  selector: 'cx-serviceability-form',
  templateUrl: './serviceability-form.component.html',
  styleUrls: ['./serviceability-form.component.scss']
})
export class ServiceabilityFormComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild(TmaAddressFormComponent, { static: true })
  addressComponent!: TmaAddressFormComponent;

  @Input()
  simpleProductOffering: TmaProduct;

  @Input()
  bundleProductOffering: TmaProduct;

  @Input()
  currentAddress?: TmaPlace;

  @Output()
  addressForm = new EventEmitter<FormGroup>();

  installationAddressDetails: FormGroup = this.fb.group({});
  installationAddress: TmaInstallationAddress;
  modalRef: any;
  serviceQualification: QueryServiceQualification;
  productNotServiceableError: boolean;
  productsNotServiceable: string[] = [];
  systemNotAvailable: boolean;
  addressError: boolean;
  errorForm: Boolean = false;

  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<
    Country
  >({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<
    Region
  >({});
  protected destroyed$ = new Subject();
  protected currentBaseSiteId: string;
  protected currentUser: User;

  constructor(
    public geographicAddressService: GeographicAddressService,
    protected fb: FormBuilder,
    protected modalService: ModalService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected spinner: NgxSpinnerService,
    protected baseSiteService: BaseSiteService,
    protected productService: ProductService,
    protected userService: UserService,
    protected queryServiceQualificationService: QueryServiceQualificationService
  ) {}

  ngOnInit(): void {
    this.spinner.hide();
    if (sessionStorage.getItem('Address')) {
      const sessionAddress: any = JSON.parse(sessionStorage.getItem('Address'));
      const country = JSON.parse(sessionStorage.getItem('Country'));
      let region;
      if (sessionStorage.getItem('Address')) {
        region = JSON.parse(sessionStorage.getItem('Region'));
      }
      this.installationAddress = {
        buildingNumber: sessionAddress.streetName.split(',')[0],
        streetName: sessionAddress.streetName.split(',')[1],
        apartmentNumber: sessionAddress.streetNr,
        city: sessionAddress.city,
        country: country,
        region: region,
        postalCode: sessionAddress.postcode
      };
    }
    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => baseSiteId != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));

    this.userService
      .get()
      .pipe(
        first((user: User) => user != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }
  ngAfterViewInit() {
    this.installationAddressDetails.addControl(
      'installationAddress',
      this.addressComponent.installationAddress
    );
    this.addressComponent.installationAddress.setParent(
      this.installationAddressDetails
    );
  }

  ngOnDestroy() {
    this.queryServiceQualificationService.clearQueryServiceQualificationState();
    this.queryServiceQualificationService.clearQueryServiceSearchResultState();
    this.queryServiceQualificationService.clearQueryServiceQualificationErrorState();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  /**
   * Sets up the isocode for the selected country
   *
   * @param country of {@link Country }
   */
  onCountrySelected(country: Country): void {
    sessionStorage.setItem('Country', JSON.stringify(country));
    this.selectedCountry$.next(country);
    this.selectedRegion$.next(null);
  }

  /**
   * Sets up the isocode for the selected region
   *
   * @param region of {@Link Region}
   */
  onRegionSelected(region: Region): void {
    sessionStorage.setItem('Region', JSON.stringify(region));
    this.selectedRegion$.next(region);
  }

  getInputAddress(): GeographicAddress {
    const user: TmaTmfRelatedParty = {
      id: ''
    };
    user.id = this.currentUser.uid;
    const address: GeographicAddress = {};
    address.relatedParty = user;

    address.isShippingAddress = false;
    address.isInstallationAddress = true;
    address.streetName =
      this.installationAddressDetails['controls'].installationAddress[
        'controls'
      ].buildingNumber.value +
      ',' +
      this.installationAddressDetails['controls'].installationAddress[
        'controls'
      ].streetName.value;
    address.streetNr = this.installationAddressDetails[
      'controls'
    ].installationAddress['controls'].apartmentNumber.value;
    address.postcode = this.installationAddressDetails[
      'controls'
    ].installationAddress['controls'].postalCode.value;
    address.city = this.installationAddressDetails[
      'controls'
    ].installationAddress['controls'].city.value;
    address.stateOfProvince =
      this.installationAddressDetails['controls'].installationAddress[
        'controls'
      ].region.value['isocode'] !== null
        ? this.installationAddressDetails['controls'].installationAddress[
            'controls'
          ].region.value['isocode']
        : null;
    address.country = this.installationAddressDetails[
      'controls'
    ].installationAddress['controls'].country.value['isocode'];
    return address;
  }
  setAddressSessionStorage() {
    sessionStorage.setItem('Address', JSON.stringify(this.getInputAddress()));
  }

  closeModal(): void {
    this.modalService.dismissActiveModal('close address component');
  }

  createInstallationAddress(): void {
    sessionStorage.removeItem('Address');
    const inputAddress = this.checkRegion(this.getInputAddress());
    sessionStorage.setItem('Address', JSON.stringify(inputAddress));
    this.checkServiceability();
  }

  /**
   * Performs the serviceability check for the product offering, if the product offering is serviceable
   * at provided installation address then it product details dialog component is rendered else error will be displayed
   */
  protected checkServiceability(): void {
    this.spinner.show();
    const inputAddress = this.checkRegion(this.getInputAddress());
    this.queryServiceQualificationService.createQueryServiceQualification(
      inputAddress
    );
    this.queryServiceQualificationService
      .getQueryServiceQualification(inputAddress)
      .pipe(
        take(2),
        filter((res: QueryServiceQualification) => !!res),
        takeUntil(this.destroyed$)
      )
      .subscribe((res: QueryServiceQualification) => {
        this.serviceQualification = res;
        if (this.serviceQualification.serviceQualificationItem) {
          this.queryServiceQualificationService.getResultsFromQueryServiceQualification(
            this.serviceQualification
          );
          const productList = [];

            productList.push(this.simpleProductOffering.code);
            this.queryServiceQualificationService
              .getNonServiceableProductOfferings(productList)
              .pipe(
                take(2),
                filter((result: string[]) => !!result),
                takeUntil(this.destroyed$)
              )
              .subscribe((productOfferings: string[]) => {
                if (!!productOfferings) {
                  if (productOfferings.length > 0) {
                   this.productsNotServiceable.push(this.simpleProductOffering.name);
                    this.productNotServiceableError = true;
                    this.errorForm = true;
                    this.spinner.hide();
                    return;
                  }
                  this.openProductDetailsDialog();
                }
              });

        } else {
          this.productsNotServiceable.push(this.simpleProductOffering.name);
          this.productNotServiceableError = true;
          this.errorForm = true;
          this.spinner.hide();
          return;
        }
      });
    this.queryServiceQualificationService
      .hasQueryServiceQualificationError()
      .pipe(
        take(2),
        filter((result: boolean) => result != null && result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: boolean) => {
        this.spinner.hide();
        this.systemNotAvailable = result;
        this.errorForm = true;
        return;
      });
  }

  private openProductDetailsDialog() {
    this.closeModal();
    let modalInstance: any;
    this.modalRef = this.modalService.open(ProductDetailsDialogComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    modalInstance = this.modalRef.componentInstance;
    modalInstance.simpleProductOffering = this.simpleProductOffering;
    if (this.bundleProductOffering !== undefined) {
      modalInstance.bundleProductOffering = this.bundleProductOffering;
    }
  }

  private checkRegion(selectedAddress) {
    if (selectedAddress.country !== 'US') {
      selectedAddress.stateOfProvince = null;
    }
    return selectedAddress;
  }
}
