import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  AfterViewChecked,
  AfterViewInit
} from '@angular/core';
import {
  User,
  Country,
  Region,
  UserService,
  BaseSiteService,
  OCC_USER_ID_ANONYMOUS,
  UserAddressService
} from '@spartacus/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import {
  GeographicAddressService,
  TmaActiveCartService,
  QueryServiceQualificationService,
  TmaTmfCartService
} from '../../../../../core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  TmaInstallationAddress,
  TmaCart,
  GeographicAddress,
  TmaTmfRelatedParty,
  QueryServiceQualification,
  TmaOrderEntry,
  TmaTmfShoppingCart,
  TmaTmfCartItem,
  TmaPlaceRole,
  TmaProduct
} from '../../../../../core';
import { TmaAddressFormComponent } from '../../../address-form';
import { ModalService } from '@spartacus/storefront';
import { first, takeUntil, filter, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'cx-journey-checklist-installation-address-form',
  templateUrl: './journey-checklist-installation-address-form.component.html',
  styleUrls: ['./journey-checklist-installation-address-form.component.scss']
})
export class JourneyChecklistInstallationAddressFormComponent
  implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @Input()
  isEdit: boolean;

  @Input()
  currentAddress: any;

  @Input()
  item: TmaOrderEntry;

  @Input()
  tmaProduct: TmaProduct;

  @Output()
  addressForm = new EventEmitter<FormGroup>();

  @ViewChild(TmaAddressFormComponent, { static: true })
  addressComponent!: TmaAddressFormComponent;

  currentCart$: Observable<TmaCart>;

  installationAddress: TmaInstallationAddress;
  installationAddressDetails: FormGroup = this.fb.group({});
  addressError: boolean;
  serviceQualification: QueryServiceQualification;
  poNotServiceableError: boolean;
  poNotServiceable: string;
  systemNotAvailable: boolean;
  protected destroyed$ = new Subject();
  protected currentUser: User;
  protected currentBaseSiteId: string;

  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<
    Country
  >({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<
    Region
  >({});

  constructor(
    public geographicAddressService: GeographicAddressService,
    protected fb: FormBuilder,
    protected changeDetectorRef: ChangeDetectorRef,
    protected modalService: ModalService,
    protected activeCartService: TmaActiveCartService,
    protected userService: UserService,
    protected baseSiteService: BaseSiteService,
    protected queryServiceQualificationService: QueryServiceQualificationService,
    protected spinner: NgxSpinnerService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected userAddressService?: UserAddressService
  ) {}

  ngOnInit() {
    this.currentCart$ = this.activeCartService.getActive();
    this.userService
      .get()
      .pipe(
        first((user: User) => user != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));
    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => baseSiteId != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));
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
    if (this.isEdit && this.currentAddress && this.currentAddress.postalCode) {
      this.installationAddress = {
        buildingNumber: this.currentAddress.line1.split(',')[0],
        streetName: this.currentAddress.line1.split(',')[1],
        apartmentNumber: this.currentAddress.line2,
        city: this.currentAddress.town,
        country: this.currentAddress.country,
        region: this.currentAddress.region,
        postalCode: this.currentAddress.postalCode
      };
    }
    if (!this.isEdit) {
      if (sessionStorage.getItem('Address')) {
        const sessionAddress: any = JSON.parse(sessionStorage.getItem('Address'));
        const country: Country = JSON.parse(sessionStorage.getItem('Country'));
        const region: Region = JSON.parse(sessionStorage.getItem('Region'));
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
    }
  }

  ngOnDestroy(): void {
    this.geographicAddressService.clearGeographicAddressError();
    this.queryServiceQualificationService.clearQueryServiceQualificationState();
    this.queryServiceQualificationService.clearQueryServiceSearchResultState();
    this.queryServiceQualificationService.clearQueryServiceQualificationErrorState();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    if (!this.addressComponent)
    {
      return;
    }

    this.installationAddressDetails.addControl(
      'installationAddress',
      this.addressComponent.installationAddress
    );
    this.addressComponent.installationAddress.setParent(
      this.installationAddressDetails
    );
    if (!this.addressComponent)
    {
      return;
    }
  }

  isValid(invalid: boolean): void {
    if (!invalid) {
      this.addressForm.emit(this.installationAddressDetails);
    } else {
      this.addressForm.emit(undefined);
    }
  }

  closeModal(): void {
    this.modalService.dismissActiveModal(
      'close journey checklist installation address component'
    );
  }

  /**
   * Sets up the isocode for the selected country
   *
   * @param country - the selected country
   */
  onCountrySelected(country: Country): void {
    sessionStorage.removeItem('Region');
    sessionStorage.setItem('Country', JSON.stringify(country));
    this.selectedCountry$.next(country);
    this.selectedRegion$.next(null);
  }

  /**
   * Sets up the isocode for the selected region
   *
   * @param region - the selected region
   */
  onRegionSelected(region: Region): void {
    sessionStorage.setItem('Region', JSON.stringify(region));
    this.selectedRegion$.next(region);
  }

  /**
   * Performs the serviceability check for the product offering,
   * if the product offering is serviceable from the product detail page then it will save the address in state
   * if the product offering is serviceable on cart page at provided installation address then add or update to cart else error message will be visible
   */
  performServiceability(): void {
    this.geographicAddressService.clearCreatedGeographicAddressState();
    const inputAddress = this.setRegion(this.getInputAddress());
    sessionStorage.setItem('Address', JSON.stringify(inputAddress));
    this.spinner.show();
    const productOfferings: string[] = [];
    const productOfferingNamesMap: Map<string, string> = new Map();
    if (this.item && this.item.product) {
      productOfferings.push(this.item.product.code);
      productOfferingNamesMap.set(
        this.item.product.code,
        this.item.product.name
      );
    } else {
      productOfferings.push(this.tmaProduct.code);
      productOfferingNamesMap.set(this.tmaProduct.code, this.tmaProduct.name);
    }

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
          this.queryServiceQualificationService
            .getNonServiceableProductOfferings(productOfferings)
            .pipe(
              take(2),
              filter((result: string[]) => !!result),
              takeUntil(this.destroyed$)
            )
            .subscribe(productOfferingResults => {
              if (!!productOfferingResults) {
                if (productOfferingResults.length > 0) {
                  productOfferingResults.forEach(
                    (nonServiceableProduct: string) => {
                      this.poNotServiceable = productOfferingNamesMap.get(
                        nonServiceableProduct
                      );
                    }
                  );
                  this.poNotServiceableError = true;
                  this.spinner.hide();
                  return;
                }
                if (this.item === undefined) {
                  this.geographicAddressService.setSelectedInstallationAddress(
                    inputAddress
                  );
                  this.spinner.hide();
                  this.closeModal();
                } else {
                  if (this.isEdit && this.currentAddress.id) {
                    this.geographicAddressService.updateGeographicAddress(
                      this.currentBaseSiteId,
                      this.currentAddress.id,
                      inputAddress
                    );
                  } else {
                    this.geographicAddressService.createGeographicAddress(
                      this.currentBaseSiteId,
                      inputAddress
                    );
                  }
                  this.geographicAddressService
                    .hasGeographicAddressError()
                    .pipe(
                      take(2),
                      filter((result: boolean) => result != null && result),
                      takeUntil(this.destroyed$)
                    )
                    .subscribe((result: boolean) => {
                      this.addressError = result;
                      return;
                    });

                  this.geographicAddressService
                    .getSelectedInstallationAddress()
                    .pipe(
                      take(2),
                      filter(
                        (result: GeographicAddress) =>
                          Object.keys(result).length !== 0
                      ),
                      takeUntil(this.destroyed$)
                    )
                    .subscribe((result: GeographicAddress) => {
                      this.updateCart(result.id);
                      this.spinner.hide();
                      this.closeModal();
                    });
                }
              }
            });
        } else {
          if (this.item) {
            this.poNotServiceable = this.item.product.name;
          } else {
            this.poNotServiceable = this.tmaProduct.name;
          }
          this.poNotServiceableError = true;
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
        return;
      });
  }

  protected updateCart(installationAddress: string): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: this.updateCartItems(installationAddress),
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  protected getInputAddress(): GeographicAddress {
    const user: TmaTmfRelatedParty = {
      id: ''
    };
    this.addressError = false;
    this.geographicAddressService.clearGeographicAddressError();
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

  protected updateCartItems(installationAddress: string): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    cartItemList.push({
      id: this.item.entryNumber.toString(),
      product: {
        place: [
          {
            id: installationAddress,
            '@referredType': 'GeographicAddress',
            role: TmaPlaceRole.INSTALLATION_ADDRESS
          }
        ]
      }
    });
    return cartItemList;
  }

  private setRegion(selectedAddress: GeographicAddress): GeographicAddress {
    if (selectedAddress.country !== 'US') {
      selectedAddress.stateOfProvince = null;
    }
    return selectedAddress;
  }
}
