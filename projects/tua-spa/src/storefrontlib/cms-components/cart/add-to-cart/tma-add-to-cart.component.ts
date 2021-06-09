import {
  AddToCartComponent,
  CurrentProductService,
  ModalService
} from '@spartacus/storefront';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Input
} from '@angular/core';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { Observable, Subject, combineLatest } from 'rxjs';
import {
  TmaChecklistAction,
  TmaChecklistActionType,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaProduct,
  LOCAL_STORAGE,
  TmfProduct,
  TmfProductCharacteristic,
  TmaTmfShoppingCart,
  TmaTmfActionType,
  GeographicAddressService,
  TmaChecklistActionTypeCheckService,
  TmaActiveCartService,
  TmaCartService,
  TmaChecklistActionService,
  JourneyChecklistConfig,
  TmaProductService,
  Reservation,
  GeographicAddress,
  RelatedPlaceRef,
  Appointment,
  AppointmentService,
  MsisdnReservationService,
  LogicalResourceType,
  TmaTmfCartService,
  LogicalResourceReservationService,
  ReservationStateType,
  AvailabilityCheckService,
  ResourceRef,
  SearchTimeSlotService,
  SearchTimeSlot,
  TmaTmfCartItem,
  TmaCart
} from '../../../../core';
import { filter, last, take, takeUntil, first, tap, distinctUntilChanged } from 'rxjs/operators';
import {
  BaseSiteService,
  UserService,
  TranslationService,
  GlobalMessageService,
  User,
  GlobalMessageType,
  Product,
  UserAddressService,
  ProductService,
  OCC_USER_ID_ANONYMOUS,
  OrderEntry,
  RoutingService
} from '@spartacus/core';
import { NgxSpinnerService } from 'ngx-spinner';
const { APPOINTMENT, INSTALLATION_ADDRESS, MSISDN_RESERVATION } = LOCAL_STORAGE;

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  styleUrls: ['./tma-add-to-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaAddToCartComponent extends AddToCartComponent implements OnInit, OnDestroy {
  @Input()
  product: Product;

  @Input()
  seeDetails: Boolean = false;

  @Input()
  isAddToCartForServiceableProducts: boolean;

  @Input()
  rootProductCode?: string;

  @Input()
  targetProductCode?: string;

  @Input()
  childProductCodes?: string[] = [];

  @Input()
  showCart: Boolean = true;

  currentProduct$: Observable<TmaProduct>;
  productCode: string;
  processType?: TmaProcessTypeEnum;
  checklistActionsTypes: TmaChecklistAction[] = [];
  uniqueActionTypes: string[] = [];
  errorResult: string;
  msisdnProducts: string[] = [];
  checklistActions: TmaChecklistAction[];
  msisdnValueSelected: string;
  addressError: boolean;
  appointmentProducts: string[] = [];
  tmaProduct: TmaProduct;
  cartEntry$: Observable<OrderEntry>;

  protected baseSiteId: string;
  protected destroyed$ = new Subject();
  protected currentUser: User;
  protected currentBaseSiteId: string;

  constructor(
    public tmaChecklistActionTypeCheckService: TmaChecklistActionTypeCheckService,
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected cartService: TmaCartService,
    protected activeCartService: TmaActiveCartService,
    public productSpecificationProductService?: TmaProductService,
    protected globalMessageService?: GlobalMessageService,
    protected translationService?: TranslationService,
    protected baseSiteService?: BaseSiteService,
    protected tmaChecklistActionService?: TmaChecklistActionService,
    protected config?: JourneyChecklistConfig,
    protected userService?: UserService,
    protected geographicAddressService?: GeographicAddressService,
    protected userAddressService?: UserAddressService,
    protected productService?: ProductService,
    protected appointmentService?: AppointmentService,
    protected spinner?: NgxSpinnerService,
    protected msisdnReservationService?: MsisdnReservationService,
    protected tmaTmfCartService?: TmaTmfCartService,
    protected logicalResourceReservationService?: LogicalResourceReservationService,
    protected availabilityCheckService?: AvailabilityCheckService,
    protected searchTimeSlotService?: SearchTimeSlotService,
    protected routingService?: RoutingService
  ) {
    super(modalService, currentProductService, changeDetectorRef, cartService);

    this.currentProduct$ = this.currentProductService.getProduct();
    this.currentProduct$.subscribe((result) => {
      this.tmaProduct = result;
    });

    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => !!baseSiteId),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));

    this.userService
      .get()
      .pipe(
        first((user: User) => user != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));

    this.getChecklistActions(this.productCode);

    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => baseSiteId != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));
  }

  ngOnDestroy(): void {
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.availabilityCheckService.clearSelectedLogicalResourceState();
    this.searchTimeSlotService.clearSelectedSearchTimeSlotState()
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Adds a SPO to the cart
   * If checklist are required then it checks where customer is login and do add to cart with checklist actions
   * If checklist are not required then directly add to cart
   *
   * @param checklistActions list of {@link TmaChecklistAction}
   */
  addSpoToCart(checklistActions?:TmaChecklistAction[]): void {
    const quantity: number = this.addToCartForm.get('quantity').value;
    if (!this.productCode || quantity <= 0) {
      return;
    }
    if (checklistActions && checklistActions.length > 0) {
      if (this.currentUser && this.currentUser.uid) {
        this.spinner.show();
        if(this.isAddToCartForServiceableProducts) {
            this.addServicableProductToCart(quantity);
        }
        else {
            this.addCartEntryWithChecklistActions(checklistActions,quantity);
        }
      }
      else {
        this.translationService
          .translate('productDetails.loginNeeded')
          .pipe(
            tap((translatedMessage: string) =>
              this.globalMessageService.add(
                translatedMessage,
                GlobalMessageType.MSG_TYPE_ERROR
              )
            )
          )
          .subscribe()
          .unsubscribe();
      }
    }
    else {
      this.cartService.addCartEntry({ 
        product: { 
          code: this.productCode
        }, 
        quantity: quantity,
        processType: { 
          id: TmaProcessTypeEnum.ACQUISITION
        }
      });
      this.addToCartDialog(quantity);
    }
  }
  addServicableProductToCart(quantity: number) {
    this.geographicAddressService.clearCreatedGeographicAddressState();
    const sessionAddress: any = JSON.parse(sessionStorage.getItem('Address'));
     if(sessionAddress.relatedParty) {
        sessionAddress.relatedParty.id = (this.currentUser && this.currentUser.uid)
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
     }
    this.geographicAddressService.createGeographicAddress(
      this.baseSiteId,
      sessionAddress
    );
    sessionStorage.setItem('Address', JSON.stringify(sessionAddress));

    this.geographicAddressService
      .getSelectedInstallationAddress()
      .pipe(
        take(2),
        filter((result: GeographicAddress) => Object.keys(result).length !== 0),
        distinctUntilChanged()
      )
      .subscribe((result: GeographicAddress) => {
        if (this.rootProductCode) {
           this.addBpoToCart(result.id);
        } else {
          this.addCartEntry(undefined, result, undefined, quantity);
        }
      });
  }

  closeModal(): void {
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.modalService.dismissActiveModal('close popup component');
  }

  /**
   * Returns the checklist actions for the provided product code
   *
   * @param productCode - product code
   * @return List of {@link TmaChecklistAction} as an {@link Observable}
   */
  getChecklistActions(productCode: string): Observable<TmaChecklistAction[]> {
    return this.tmaChecklistActionService.getChecklistActionForProductCode(
      this.baseSiteId,
      productCode,
      TmaProcessTypeEnum.ACQUISITION
    );
  }

  /**
   * Checks if installation address is provided or not
   *
   * @return True if has installation address present, otherwise false
   */
  isInstallationAddressSelected(): Boolean {
    let selectedInstallationAddress: Boolean = false;
    this.geographicAddressService
      .getSelectedInstallationAddress()
      .pipe(
        take(2),
        filter((result: GeographicAddress) => !!result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: GeographicAddress) => {
        if (Object.keys(result).length > 0) {
        selectedInstallationAddress = true;
        }
      });
      return selectedInstallationAddress;
  }

  /**
   * Checks if search time slot is provided or not
   *
   * @return True if has search time slot present, otherwise false
   */
  isSearchTimeSlotSelected(): Boolean {
    let searchTimeSlotSelected: Boolean = false;
    this.searchTimeSlotService
      .getSelectedTimeSlot()
      .pipe(
        take(2),
        filter((result: SearchTimeSlot) => !!result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: SearchTimeSlot) => {
        if (Object.keys(result).length > 0) {
          searchTimeSlotSelected = true;
        }
      });
    return searchTimeSlotSelected;
  }

  /**
   * Checks if MSISDN is provided or not
   *
   * @return True if has MSISDN present, otherwise false
   */
  isMsisdnSelected(): Boolean {
    let msisdnSelected: Boolean = false;
    this.availabilityCheckService
      .getSelectedLogicalResource()
      .pipe(
        filter((result: ResourceRef) => !!result),
        take(2),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: ResourceRef) => {
        if (Object.keys(result).length > 0) {
          msisdnSelected = true;
        }
      });
    return msisdnSelected;
  }

  /**
   * Checks if the Add To Cart button should be displayed
   *
   * @param checklistActions - list of checklist actions
   * @param productSpecificationId - product specification id
   */
  shouldDisplayAddToCartButton(
    checklistActions: TmaChecklistAction[],
    productSpecificationId: string
  ): boolean {
    if (
      !this.productSpecificationProductService.isProductSpecificationForViewDetails(
        productSpecificationId
      )
    ) {
      return !this.productSpecificationProductService.isProductSpecificationForViewDetails(
        productSpecificationId
      );
    }
    if (
      checklistActions.find(
        (checklistAction: TmaChecklistAction) =>
          checklistAction.actionType ===
          TmaChecklistActionType.INSTALLATION_ADDRESS
      )
    ) {
      return false;
    }
    this.translationService
      .translate('premiseDetails.checkAvailabilityErrorMessage')
      .pipe(first((translation: string) => !!translation))
      .subscribe((translation: string) =>
        this.globalMessageService.add(
          translation,
          GlobalMessageType.MSG_TYPE_ERROR
        )
      )
      .unsubscribe();
    return true;
  }
/**
 * Disable add to cart button if the checklist actions are not fulfilled
 *
 * @param checklistActions list of {@link TmaChecklistAction}
 * @returns True if checklist actions is not fulfilled
 */
disableAddToCart(checklistActions: TmaChecklistAction[]): Boolean {
  if(this.isAddToCartForServiceableProducts) {
    return false;
  }
    let appointmentNotSelected: Boolean = false;
    let installationAddressNotSelected: Boolean = false;
    let msisdnNotSelected: Boolean = false;
    if (checklistActions) {
      checklistActions.forEach((checklistAction: TmaChecklistAction) => {
        if (checklistAction.actionType === TmaChecklistActionType.APPOINTMENT) {
          appointmentNotSelected = !this.isSearchTimeSlotSelected();
        }
        if (
          checklistAction.actionType ===
          TmaChecklistActionType.INSTALLATION_ADDRESS
        ) {
          installationAddressNotSelected = !this.isInstallationAddressSelected();
        }
        if (checklistAction.actionType === TmaChecklistActionType.MSISDN) {
          msisdnNotSelected = !this.isMsisdnSelected();
        }
      });
      return (
        appointmentNotSelected ||
        installationAddressNotSelected ||
        msisdnNotSelected
      );
    }
  }

  /**
   * Check if appointment, msisdn, installation address checklist actions are required,
   * if yes it creates appointment, geographic address, reservation then adds product to cart
   *
   * @param checklistActions list of {@link TmaChecklistAction}
   */
  protected addCartEntryWithChecklistActions(checklistActions:TmaChecklistAction[],quantity:number): void {
    let appointmentRequired = false;
    let msisdnRequired = false;
    let installationRequired = false;
    let appointment$: Observable<Appointment>;
    let installation$: Observable<GeographicAddress>;
    let msisdn$: Observable<Reservation>;
    if (checklistActions) {
      checklistActions.forEach((checklistAction: TmaChecklistAction) => {
        if (checklistAction.actionType === TmaChecklistActionType.APPOINTMENT) {
          appointmentRequired = true;
          this.appointmentService.createAppointmentForTimeSlot();
        }
        if (
          checklistAction.actionType ===
          TmaChecklistActionType.INSTALLATION_ADDRESS
        ) {
          installationRequired = true;
          this.geographicAddressService
            .getSelectedInstallationAddress()
            .pipe(
              take(1),
              filter(
                (result: GeographicAddress) => Object.keys(result).length !== 0
              ),
              takeUntil(this.destroyed$)
            )
            .subscribe((result: GeographicAddress) => {
              this.geographicAddressService.createGeographicAddress(
                this.currentBaseSiteId,
                result
              );
            });
        }
        if (checklistAction.actionType === TmaChecklistActionType.MSISDN) {
          msisdnRequired = true;
          this.msisdnReservationService.createReservationFor(this.tmaProduct);
        }
      });
    }
    if (appointmentRequired) {
      this.appointmentService
        .getCreateAppointmentError()
        .pipe(
          take(2),
          filter((result: string) => result != null),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: string) => {
          this.spinner.hide();
          this.errorResult = result;
          return;
        });

      appointment$ = this.appointmentService.getCreatedAppointment().pipe(
        take(2),
        filter((result: Appointment) => Object.keys(result).length !== 0),
        takeUntil(this.destroyed$)
      );
    }
    if (installationRequired) {
      this.geographicAddressService
        .hasGeographicAddressError()
        .pipe(
          take(2),
          filter((result: boolean) => result != null && result),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: boolean) => {
          this.spinner.hide();
          this.addressError = result;
          return;
        });

      installation$ = this.geographicAddressService
        .getSelectedInstallationAddress()
        .pipe(
          take(2),
          filter(
            (result: GeographicAddress) =>
              Object.keys(result).length !== 0 &&
              result['@type'] === INSTALLATION_ADDRESS.GEOGRAPHIC_ADDRESS
          ),
          takeUntil(this.destroyed$)
        );
    }
    if (msisdnRequired) {
      this.logicalResourceReservationService
        .getCreateReservationError()
        .pipe(
          take(2),
          filter((result: string) => result != null),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: string) => {
          this.spinner.hide();
          this.errorResult = result;
          return;
        });
      msisdn$ = this.logicalResourceReservationService.getCreatedReservation().pipe(
        take(2),
        filter((result: Reservation) => Object.keys(result).length !== 0),
        takeUntil(this.destroyed$)
      );
      msisdn$
        .subscribe((result: Reservation) => {
          if (
            result.reservationState.toUpperCase() ===
            (ReservationStateType.REJECTED.toUpperCase() ||
              ReservationStateType.CANCELLED.toUpperCase())
          ) {
            this.spinner.hide();
            this.errorResult = result.reservationState;
            return;
          }
        });
    }

    const cartRequestCheckList: Observable<any>[] = [];
    if (installation$) {
      cartRequestCheckList.push(installation$);
    }
    if (appointment$) {
      cartRequestCheckList.push(appointment$);
    }
    if (msisdn$) {
      cartRequestCheckList.push(msisdn$);
    }

    const cartRequest = combineLatest(cartRequestCheckList);

    cartRequest.subscribe((values) => {
      if (Object.keys(values).length > 0) {
        let appointmentId: string;
        let installationAddress: GeographicAddress;
        let msisdnValue: Reservation;
        values.forEach(
          (value: Appointment | GeographicAddress | Reservation) => {
            if (value['@type'] === APPOINTMENT.APPOINTMENT_TYPE) {
              appointmentId = value.id;
            }
            if (value['@type'] === INSTALLATION_ADDRESS.GEOGRAPHIC_ADDRESS) {
              installationAddress = <GeographicAddress>value;
            }
            if (value['@type'] === MSISDN_RESERVATION.RESOURCE_ITEM_RESERVATION) {
              msisdnValue = <Reservation>value;
            }
          }
        );
        this.addCartEntry(appointmentId, installationAddress, msisdnValue, quantity);
      }
    });
  }

protected addCartEntry(
  appointmentId?: string,
  installationAddress?: GeographicAddress,
  msisdnValue?: Reservation,
  quantity?: number
): void {
  const currentUserId: string =
    this.currentUser && this.currentUser.uid
      ? this.currentUser.uid
      : OCC_USER_ID_ANONYMOUS;
  const installationAddressId = installationAddress
    ? installationAddress.id
    : undefined;
  if (
    msisdnValue !== undefined &&
    !!msisdnValue.reservationItem[0] &&
    !!msisdnValue.reservationItem[0].appliedCapacityAmount[0].resource[0]
      .value
  ) {
    this.msisdnValueSelected =
      msisdnValue.reservationItem[0].appliedCapacityAmount[0].resource[0].value;
  }
  const shoppingCart: TmaTmfShoppingCart = {
    baseSiteId: this.currentBaseSiteId,
    cartItem: [
      {
        action: TmaTmfActionType.ADD,
        processType: {
          id: TmaProcessTypeEnum.ACQUISITION
        },
        productOffering: {
          id: this.productCode
        },
        quantity: quantity,
        appointment: this.createAppointment(appointmentId),
        product: this.createTmfResource(
          msisdnValue,
          installationAddressId
        )
      }
    ],
    relatedParty: [
      {
        id: currentUserId
      }
    ]
  };
  this.tmaTmfCartService.updateCart(shoppingCart);
  if(!this.showCart) {
    this.routingService.go({ cxRoute: 'cart' });
    this.closeModal();
  }
  else {
    this.addToCartDialog(quantity);
  }
}

  protected openAddToCartModal(entry$: Observable<TmaOrderEntry>): void {
    this.spinner.hide();
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
      centered: true,
      size: 'lg'
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = entry$;
    modalInstance.cart$ = this.cartService.getActive();
    modalInstance.loaded$ = this.cartService.isStable();
    modalInstance.quantity = this.quantity;
    modalInstance.numberOfEntriesBeforeAdd = this.numberOfEntriesBeforeAdd;
  }

  protected addToCartDialog(quantity: number) {
    const newEntry$: Observable<TmaOrderEntry> = this.activeCartService.getSpoWithHighestEntryNumber(
      this.productCode
    );
    newEntry$
      .pipe(
        take(2),
        filter((newEntry: TmaOrderEntry) => !!newEntry),
        last(),
        takeUntil(this.destroyed$)
      )
      .subscribe((newEntry: TmaOrderEntry) => {
        this.numberOfEntriesBeforeAdd = newEntry.quantity;
        this.openAddToCartModal(newEntry$);
      });
  }

  protected createAppointment(id: string): Appointment {
    if (id === undefined) {
      return undefined;
    }
    return {
      id: id
    };
  }

  protected createTmfResource(
    msisdnValue: Reservation,
    addressId: string
  ): TmfProduct {
    return {
      place: this.createInstallationAddress(addressId),
      characteristic: this.createMsisdn(msisdnValue)
    };
  }

  protected createMsisdn(
    msisdnValue: Reservation
  ): TmfProductCharacteristic[] {
    if (!msisdnValue) {
      return undefined;
    }
    return [
      {
        id: msisdnValue.id,
        name: LogicalResourceType.MSISDN,
        value: this.msisdnValueSelected
      }
    ];
  }

  protected createInstallationAddress(addressId: string): RelatedPlaceRef[] {
    if (!addressId) {
      return undefined;
    }
    return [
      {
        id: addressId,
        '@referredType': 'GeographicAddress',
        role: 'INSTALLATION_ADDRESS'
      }
    ];
  }

 /**
   * Adds bundle product offering to cart along with installation address and appointment
   *
   * @param currentCart as an {@link TmaCart}
   * @param installationAddress as an {@link String}
   *
   * @return  shopping cart as {@link TmaTmfShoppingCart}
   */
  addBpoToCart(
    installationAddress: string
  ): void {
    if (Object.keys(this.childProductCodes).length < 1) {
      this.translationService
        .translate('serviceability.bpoIncorrectConfigured')
        .pipe(
          tap((translatedMessage: string) =>
            this.globalMessageService.add(
              translatedMessage,
              GlobalMessageType.MSG_TYPE_ERROR
            )
          )
        )
        .subscribe()
        .unsubscribe();
      this.closeModal();
      return;
    } else {
      const currentUserId: string =
        this.currentUser && this.currentUser.uid
          ? this.currentUser.uid
          : OCC_USER_ID_ANONYMOUS;
      const shoppingCart: TmaTmfShoppingCart = {
        baseSiteId: this.baseSiteId,
        cartItem: this.createCartItems(installationAddress),
        relatedParty: [
          {
            id: currentUserId
          }
        ]
      };
      this.tmaTmfCartService.updateCart(shoppingCart);
      this.routingService.go({ cxRoute: 'cart' });
      this.closeModal();
    }
  }

  /**
   * Create the cart item for root node (e.g quadPlay) with hierarchical structure
   *
   * @param installationAddress as an {@link String}
   *
   * @return cart item array of {@link TmaTmfCartItem}
   */
  protected createCartItems(installationAddress: string): TmaTmfCartItem[] {
    const cartItems: TmaTmfCartItem[] = [];
    const cartItem = {
      processType: {
        id: TmaProcessTypeEnum.ACQUISITION
      },
      productOffering: {
        id: this.childProductCodes[0]
      },
      quantity: 1,
      cartItem: this.createHierarchicalCartItems(
        this.childProductCodes[1],
        this.childProductCodes.length,
        1,
        installationAddress
      )
    };
    cartItems.push(cartItem);
    return cartItems;
  }

  /**
   * Create the  child cart (e.g homeDeal, broadband, fiber_internet ) items other
   * than root node (e.g quadPlay) with hierarchical structure
   *
   * @param code code of the immediate child product offering
   * @param length length of the hierarchical structure
   * @param index  current element of hierarchical structure
   * @param installationAddress as an {@link String}
   *
   * @return  cart item array {@link TmaTmfCartItem}
   */
  protected createHierarchicalCartItems(
    code: string,
    length: number,
    index: number,
    installationAddress: string
  ): TmaTmfCartItem[] {
    const cartItems: TmaTmfCartItem[] = [];
    if (index < length - 1) {
      let cartItem: TmaTmfCartItem;
      cartItem = {
        productOffering: {
          id: code
        },
        quantity: 1,
        cartItem: this.createHierarchicalCartItems(
          this.childProductCodes[index + 1],
          this.childProductCodes.length,
          index + 1,
          installationAddress
        )
      };
      cartItems.push(cartItem);
    } else {
      cartItems.push(this.createCartItem(code, installationAddress));
    }
    return cartItems;
  }

  protected createCartItem(
    code: string,
    installationAddress: string
  ): TmaTmfCartItem {
    return {
      action: TmaTmfActionType.ADD,
      product: {
        place: this.populateInstallationAddress(installationAddress)
      },
      productOffering: {
        id: code
      },
      quantity: 1
    };
  }

  protected populateInstallationAddress(addressId: string): RelatedPlaceRef[] {
    if (!addressId) {
      return undefined;
    }
    return [
      {
        id: addressId,
        '@referredType': 'GeographicAddress',
        role: 'INSTALLATION_ADDRESS'
      }
    ];
  }
}
