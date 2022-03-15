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
  User
} from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { ModalService } from '@spartacus/storefront';
import {
  GeographicAddress,
  TmaInstallationAddress,
  QueryServiceQualificationService,
  TmaProductListComponentService
} from '../../../../core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TmaAddressFormComponent } from '../../address-form';
import { takeUntil, first, take, filter } from 'rxjs/operators';
import {
  QueryServiceQualification,
  GeographicAddressService,
  TmaPlace,
  TmaTmfRelatedParty
} from '../../../../core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'lib-serviceability-category-form',
  templateUrl: './serviceability-category-form.component.html',
  styleUrls: ['./serviceability-category-form.component.scss']
})
export class ServiceabilityCategoryFormComponent
  implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild(TmaAddressFormComponent, { static: true })
  addressComponent!: TmaAddressFormComponent;

  @Input()
  simpleProductOffering: Map<string, string>;

  @Input()
  bundleProductOffering: Map<string, string>;

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
  systemNotAvailable: Boolean = false;
  addressError: boolean;
  errorForm: Boolean = false;
  hasError: boolean;

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
    protected userAccountFacade: UserAccountFacade,
    protected queryServiceQualificationService: QueryServiceQualificationService,
    protected tmaProductListComponentService?: TmaProductListComponentService
  ) {}

  ngOnInit(): void {
    this.spinner.hide();
    if (sessionStorage.getItem('Address')) {
      const addressLocal: any = JSON.parse(sessionStorage.getItem('Address'));
      const country = JSON.parse(sessionStorage.getItem('Country'));
      let region;
      if (sessionStorage.getItem('Address')) {
        region = JSON.parse(sessionStorage.getItem('Region'));
      }
      this.installationAddress = {
        buildingNumber: addressLocal.streetName.split(',')[0],
        streetName: addressLocal.streetName.split(',')[1],
        apartmentNumber: addressLocal.streetNr,
        city: addressLocal.city,
        country: country,
        region: region,
        postalCode: addressLocal.postcode
      };
    }
    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => baseSiteId != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));

    this.userAccountFacade
      .get()
      .pipe(
        first((user: User) => user != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));
    this.queryServiceQualificationService.clearQueryServiceQualificationErrorState();
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

  /**
   * Performs the following
   * 
   * - Clears the address stored in session storage 
   * - Gets the address from input address and sets in session storage
   * - Service qualification call for input address
   * - Check if the service qualification system is available 
   * - Performs the product search
   */
  checkServiceability(): void {
      sessionStorage.removeItem('Address');
      const inputAddress = this.checkRegion(this.getInputAddress());
      sessionStorage.setItem('Address', JSON.stringify(inputAddress));

      this.queryServiceQualificationService.createQueryServiceQualification(
        inputAddress
      );
      this.queryServiceQualificationService
        .hasQueryServiceQualificationError()
        .pipe(
          take(2),
          filter((result: boolean) => result != null),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: boolean) => {
        if (result) {
          this.systemNotAvailable = result;
        } else {
          this.queryServiceQualificationService.selectedInstallationAddress(
            inputAddress
          );
          this.closeModal();
          this.tmaProductListComponentService.getProductSearch();
        }
      });
  }

  private checkRegion(selectedAddress) {
    if (selectedAddress.country !== 'US') {
      selectedAddress.stateOfProvince = null;
    }
    return selectedAddress;
  }
}
