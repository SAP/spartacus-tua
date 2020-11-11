import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Address,
  GlobalMessageService,
  GlobalMessageType,
  OrderEntry,
  ProductService,
  RoutingService,
  TranslationService,
  User,
  UserService,
  WindowRef
} from '@spartacus/core';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { TmaCartService } from '../../../../core/cart/facade';
import {
  TmaActionType,
  TmaAddress,
  TmaOrderEntry,
  TmaPlaceRole,
  TmaPremiseDetail,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaRelatedParty,
  TmaRelatedPartyRole,
  TmaTechnicalResources
} from '../../../../core/model';
import { TmaPremiseDetailService } from '../../../../core/premisedetail/facade';
import { TmaUserAddressService } from '../../../../core/user/facade/tma-user-address.service';
import { TmaInstallationAddressConverter } from '../../../../core/util/converters';
import { TmaAddedToCartDialogComponent } from '../../cart/add-to-cart/added-to-cart-dialog/tma-added-to-cart-dialog.component';

@Component({
  selector: 'cx-premise-details',
  templateUrl: './tma-premise-details.component.html',
  styleUrls: ['./premise-details-display/tma-premise-details-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPremiseDetailsComponent implements OnInit, OnDestroy {

  @Input()
  productCode: string;

  @Input()
  cartEntry$: Observable<TmaOrderEntry>;

  premiseDetails: TmaPremiseDetail;
  contractStartDate: string;
  serviceProvider: string;

  premiseDetailsStep: string;
  isMoveIn: boolean;

  validationResult$: Observable<TmaTechnicalResources>;
  activeUser$: Observable<User>;
  product$: Observable<TmaProduct>;
  addresses$: Observable<Address[]>;

  protected modalRef: ModalRef;
  protected destroyed$ = new Subject();


  constructor(
    protected premiseDetailService: TmaPremiseDetailService,
    protected userService: UserService,
    protected globalMessageService: GlobalMessageService,
    protected translationService: TranslationService,
    protected userAddressService: TmaUserAddressService,
    protected cartService: TmaCartService,
    protected installationAddressConverter: TmaInstallationAddressConverter,
    protected productService: ProductService,
    protected modalService: ModalService,
    protected windowRef: WindowRef,
    protected routingService: RoutingService,
    protected location: Location
  ) { }

  ngOnInit(): void {
    this.activeUser$ = this.userService.get();
    this.product$ = this.productService.get(this.productCode);
    this.premiseDetailsStep = "premiseCheckButton";
    this.userAddressService.loadAddresses();
    this.addresses$ = this.userAddressService.getAddresses();
    this.isMoveIn = true;

    this.cartEntry$ = this.cartService.getEntry(this.productCode);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Validates the provided premise details.
   * 
   * @param premiseDetails - The premise details
   * @param product - The product offering
   */
  validatePremiseDetails(premiseDetails: TmaPremiseDetail, product: TmaProduct): void {
    this.premiseDetails = premiseDetails;
    this.premiseDetails.meter.type = this.getMeterType(product);
    this.premiseDetailsStep = "premiseValidationResult";
    this.validationResult$ = this.premiseDetailService.validatePremiseDetails(premiseDetails);
  }

  /**
   * Updates the premise details
   *
   * @param premiseDetails - The premise details
   */
  updatePremiseDetails(premiseDetails: TmaPremiseDetail): void {
    this.premiseDetails = premiseDetails;
    this.onChangePremiseDetailsStep();
  }

  /**
   * Updates the contract start date
   * 
   * @param contractStartDate - the contract start date
   */
  updateContractStartDate(contractStartDate: string): void {
    this.contractStartDate = contractStartDate;
  }

  /**
   * Updating the energy supplier
   * 
   * @param supplier - edited supplier
   */
  energySupplierEdited(supplier: string): void {
    if (supplier && supplier !== '') {
      this.serviceProvider = supplier;
      return;
    }

    this.serviceProvider = undefined;
  }

  /**
   * Adding the selected product to cart
   * 
   * @param activeUser - logged in user
   * @param addresses - premise addresses
   */
  addToCart(activeUser: User, addresses: Address[]): void {
    if (activeUser && !activeUser.uid) {
      this.translationService.translate('productDetails.loginNeeded').pipe(
        tap((translatedMessage: string) => this.globalMessageService.add(translatedMessage, GlobalMessageType.MSG_TYPE_ERROR)),
        takeUntil(this.destroyed$)
      ).subscribe();
      return;
    }

    const address: TmaAddress = this.installationAddressConverter.convertSourceToTarget(this.premiseDetails.installationAddress);
    address.firstName = activeUser.firstName;
    address.lastName = activeUser.lastName;
    address.email = activeUser.uid;
    address.installationAddress = true;
    address.visibleInAddressBook = false;

    this.userAddressService.addUserAddress(address);
    this.userAddressService.getAddresses()
      .pipe(
        takeUntil(this.destroyed$),
        first((addressList: Address[]) => addresses.length !== addressList.length))
      .subscribe((addressesAll: Address[]) => {
        const addressesAllIds = [];
        const addressesIds = [];
        addressesAll.forEach((a: Address) => addressesAllIds.push(a.id));
        addresses.forEach((a: Address) => addressesIds.push(a.id));
        const addedAddressId: string = addressesAllIds.filter(item => addressesIds.indexOf(item) < 0)[0];
        if (addedAddressId) {
          this.openModal(addedAddressId);
          this.cartService.addCartEntry(this.createCartEntry(addedAddressId));
        }
      });
  }

  /**
   * Sets the isMoveIn flag to true
   */
  onSetMoveIn(): void {
    this.isMoveIn = true;
  }

  /**
   * Sets the isMoveIn flag to false
   */
  onUnsetMoveIn(): void {
    this.isMoveIn = false;
  }

  /**
   * Shows the premise details form on the page
   */
  onChangePremiseDetailsStep(): void {
    this.premiseDetailsStep = "premiseDetailsStep";
  }

  /**
   * Navigates to the previous page
   */
  onGoToPreviousPage(): void {
    if (this.windowRef.nativeWindow.history.length > 1) {
      this.location.back();
      return;
    }
    this.routingService.go({ cxRoute: 'home' });
  }

  /**
   * Verifies that the premise validation is successful
   * 
   * @param validationResult - the premise validation result
   */
  verifyPremiseResultValidity(validationResult: TmaTechnicalResources): boolean {
    return !!(validationResult.technicalResources && !validationResult.error);
  }

  /**
   * Creates a cart entry
   * 
   * @param addressId - the address id
   * @returns The created cart entry {@link TmaOrderEntry}
   */
  protected createCartEntry(addressId: string): TmaOrderEntry {
    return this.serviceProvider ?
      {
        action: TmaActionType.ADD,
        product: {
          code: this.productCode
        },
        subscribedProduct: {
          characteristic: [
            {
              name: 'meter_id',
              value: this.premiseDetails.meter.id
            }
          ],
          place: [
            {
              id: addressId,
              role: TmaPlaceRole.INSTALLATION_ADDRESS
            }
          ],
          relatedParty: [
            this.getServiceProvider()
          ]
        },
        processType: { id: this.serviceProvider ? TmaProcessTypeEnum.SWITCH_SERVICE_PROVIDER : TmaProcessTypeEnum.ACQUISITION },
        contractStartDate: this.contractStartDate,
        quantity: 1
      } :
      {
        action: TmaActionType.ADD,
        product: {
          code: this.productCode
        },
        subscribedProduct: {
          characteristic: [
            {
              name: 'meter_id',
              value: this.premiseDetails.meter.id
            }
          ],
          place: [
            {
              id: addressId,
              role: TmaPlaceRole.INSTALLATION_ADDRESS
            }
          ]
        },
        processType: { id: this.serviceProvider ? TmaProcessTypeEnum.SWITCH_SERVICE_PROVIDER : TmaProcessTypeEnum.ACQUISITION },
        contractStartDate: this.contractStartDate,
        quantity: 1
      };
  }

  /**
   * Returns the related party
   * 
   * @returns A {@link TmaRelatedParty}
   */
  protected getServiceProvider(): TmaRelatedParty {
    return this.serviceProvider ?
      {
        id: this.serviceProvider,
        role: TmaRelatedPartyRole.SERVICE_PROVIDER
      } : undefined;
  }

  /**
   * Returns the type of the meter for a given product
   * 
   * @param product - the product
   * @returns The meter type as a {@link string}
   */
  protected getMeterType(product: TmaProduct): string {
    return product && product.productSpecification && product.productSpecification.id ? product.productSpecification.id : null;
  }

  /**
   * Opens the popup modal
   * 
   * @param addedAddressId - entered address id
   */
  protected openModal(addedAddressId: string): void {
    this.cartService.getEntries()
      .pipe(
        takeUntil(this.destroyed$),
        first((addr: OrderEntry[]) => addr !== null))
      .subscribe((addr: OrderEntry[]) => {
        if (addr) {
          let modalInstance: any;
          this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
            centered: true,
            size: 'lg'
          });

          modalInstance = this.modalRef.componentInstance;
          modalInstance.entry$ = this.cartEntry$;
          modalInstance.cart$ = this.cartService.getActive();
          modalInstance.loaded$ = this.cartService.getLoaded();
          modalInstance.quantity = 1;
          modalInstance.increment = false;
        }
      }
      );
  }
}
