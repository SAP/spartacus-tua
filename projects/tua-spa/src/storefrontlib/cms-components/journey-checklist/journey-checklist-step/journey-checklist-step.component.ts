import {
  Appointment,
  TmaTmfCartItem,
  TmaProduct,
  RelatedPlaceRef,
  GeographicAddress,
  TmaTmfRelatedParty,
  TimeSlot,
  TimePeriod,
  LogicalResourceType,
  TmfProduct,
  TmfProductCharacteristic,
  TmaPlace,
  TmaPlaceRole,
} from "../../../../core/model";
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Observable, Subject, Subscriber } from "rxjs";
import {
  TmaChecklistAction,
  TmaOrderEntry,
  TmaActiveCartService,
  TmaTmfCartService,
  TmaCart,
  TmaProcessTypeEnum,
  TmaTmfShoppingCart,
  TmaTmfActionType,
  TmaGuidedSellingCurrentSelectionsService,
  LOCAL_STORAGE,
  GeographicAddressService,
  SearchTimeSlotService,
  Reservation,
  ReservationStateType,
} from "../../../../core";
import { take, filter, last, first, takeUntil } from "rxjs/operators";
import { TmaAddedToCartDialogComponent } from "../../cart/add-to-cart/added-to-cart-dialog/tma-added-to-cart-dialog.component";
import { ModalRef, ModalService } from "@spartacus/storefront";
import { AppointmentService } from "../../../../core/appointment/facade";
import {
  OCC_USER_ID_ANONYMOUS,
  User,
  UserService,
  BaseSiteService,
  ProductService,
  CxDatePipe,
} from "@spartacus/core";
import { NgbTabsetConfig, NgbTabset } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import {
  LogicalResourceReservationService,
  MsisdnReservationService,
} from "../../../../core/reservation/facade";
import { TmaGuidedSellingAddedToCartDialogComponent } from "../../guided-selling/guided-selling-current-selection/guided-selling-added-to-cart-dialog/tma-guided-selling-added-to-cart-dialog.component";
import { FormGroup } from "@angular/forms";

const { CHECKLIST_ACTION_TYPE_APPOINTMENT } = LOCAL_STORAGE.APPOINTMENT;
const {
  CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS,
} = LOCAL_STORAGE.INSTALLATION_ADDRESS;
const { CHECKLIST_ACTION_TYPE_MSISDN } = LOCAL_STORAGE.MSISDN_RESERVATION;

@Component({
  selector: "cx-journey-checklist-step",
  templateUrl: "./journey-checklist-step.component.html",
  styleUrls: ["./journey-checklist-step.component.scss"],
  providers: [NgbTabsetConfig],
})
export class JourneyChecklistStepComponent
  implements AfterViewChecked, OnInit, OnDestroy {
  @Input()
  checklistActions: TmaChecklistAction[];

  @Input()
  productOfferingCodes: string[];

  @Input()
  quantity: number;

  @Input()
  bpoCode: string;

  @Input()
  productCode: string;

  @Input()
  currentAddress?: TmaPlace;

  @ViewChild("addToCartButton", { static: false })
  addToCartButton: ElementRef;

  cartEntries: TmaOrderEntry[];
  isEdit: boolean;
  increment = false;
  currentCart$: Observable<TmaCart>;
  error: string;
  errorResult: string;
  isMsisdnSelected: boolean;
  shoppingCart: TmaTmfShoppingCart;
  msisdnValueSelected: string;
  logicalResourceError: any;
  addressError: boolean;
  parentBpo: TmaProduct;
  currentSelectedTimePeriod?: TimePeriod;
  currentSelectedStartDate: Date;
  currentAppointmentId: string;
  timeSlotChanged: boolean;
  selectedAvailableTimeSlot: any = null;
  checklistActionsTypes: TmaChecklistAction[] = [];
  uniqueActionTypes: string[] = [];
  installationAddressForm: FormGroup;
  errPatch: any;
  installationProducts: string[] = [];
  appointmentProducts: string[] = [];
  msisdnProducts: string[] = [];

  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected modalRef: ModalRef;
  protected destroyed$ = new Subject();

  constructor(
    config: NgbTabsetConfig,
    public geographicAddressService: GeographicAddressService,
    protected modalService: ModalService,
    protected activeCartService: TmaActiveCartService,
    protected baseSiteService: BaseSiteService,
    protected appointmentService: AppointmentService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected userService: UserService,
    protected spinner: NgxSpinnerService,
    protected productService: ProductService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected tmaSearchTimeSlotService: SearchTimeSlotService,
    protected tmfAppointmentService: AppointmentService,
    protected logicalResourceReservationService: LogicalResourceReservationService,
    protected msisdnReservationService: MsisdnReservationService,
    protected datePipe: CxDatePipe,
    private cdRef?: ChangeDetectorRef
  ) {
    // customize default values of tabSets used by this component tree
    config.justify = "center";
    config.type = "pills";
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.isMsisdnSelected = false;
    this.timeSlotChanged = true;
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

    if (this.bpoCode) {
      this.productService
        .get(this.bpoCode)
        .pipe(
          first((product: TmaProduct) => product !== null),
          takeUntil(this.destroyed$)
        )
        .subscribe((product: TmaProduct) => (this.parentBpo = product));
    }

    this.uniqueActionTypes = [
      ...new Set(
        this.checklistActions
          .map(
            (checklistAction: TmaChecklistAction) => checklistAction.actionType
          )
          .sort()
          .reverse()
      ),
    ];

    this.uniqueActionTypes.forEach((uniqueActionType: string) => {
      const actionType: TmaChecklistAction = {
        actionType: uniqueActionType,
      };
      this.checklistActionsTypes.push(actionType);
    });

    this.installationProducts = this.getInstallationProducts();
    this.appointmentProducts = this.getAppointmentProducts();
    this.msisdnProducts = this.getMsisdnProducts();
  }

  ngOnDestroy() {
    this.appointmentService.clearAppointmentState();
    this.appointmentService.clearCreatedAppointmentState();
    this.appointmentService.clearAppointmentError();
    this.geographicAddressService.clearGeographicAddressError();
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.logicalResourceReservationService.clearCreatedReservationState();
    this.logicalResourceReservationService.clearReservationError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  closeModal(): void {
    this.modalService.dismissActiveModal("close stepper component");
  }

  submit(currentCart: TmaCart): void {
    this.spinner.show();
    this.addCartEntryWithChecklistActions(currentCart);
    const newEntry$: Observable<TmaOrderEntry> = this.activeCartService.getSpoWithHighestEntryNumber(
      this.productOfferingCodes[0]
    );
    newEntry$
      .pipe(
        take(2),
        filter((newEntry: TmaOrderEntry) => !!newEntry),
        last(),
        takeUntil(this.destroyed$)
      )
      .subscribe((newEntry: TmaOrderEntry) => {
        this.increment = newEntry.quantity > 1;
        this.modalService.closeActiveModal("close stepper component");
        this.openAddToCartModal(newEntry$);
      });
  }

  addCartEntryWithChecklistActions(currentCart: TmaCart): void {
    let appointmentRequired = false;
    let msisdnRequired = false;
    let installationRequired = false;
    this.checklistActionsTypes.forEach(
      (checklistAction: TmaChecklistAction) => {
        if (checklistAction.actionType === CHECKLIST_ACTION_TYPE_APPOINTMENT) {
          appointmentRequired = true;
          this.appointmentService.createAppointmentForTimeSlot();
        }
        if (
          checklistAction.actionType ===
          CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS
        ) {
          installationRequired = true;
          this.geographicAddressService
            .getSelectedInstallationAddress()
            .pipe(take(2), takeUntil(this.destroyed$))
            .subscribe((result: GeographicAddress) => {
              if (Object.keys(result).length === 0) {
                this.createInstallationAddress();
              }
            });
        }
        if (checklistAction.actionType === LogicalResourceType.MSISDN) {
          msisdnRequired = true;
          this.productService
            .get(this.productOfferingCodes[0])
            .pipe(
              take(2),
              filter((product: TmaProduct) => product != null),
              takeUntil(this.destroyed$)
            )
            .subscribe((product: TmaProduct) => {
              this.msisdnReservationService.createReservationForMsisdn(product);
            });
        }
      }
    );
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
      this.appointmentService
        .getCreatedAppointment()
        .pipe(
          take(2),
          filter((result: Appointment) => Object.keys(result).length !== 0),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: Appointment) => {
          this.addToCart(currentCart, result.id, result.relatedPlace);
        });
    } else if (installationRequired) {
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
      this.geographicAddressService
        .getSelectedInstallationAddress()
        .pipe(
          take(2),
          filter(
            (result: GeographicAddress) => Object.keys(result).length !== 0
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: GeographicAddress) => {
          this.addToCart(currentCart, undefined, result);
        });
    }
    if (msisdnRequired) {
      this.addToCartWithMsisdnReservation(currentCart);
    }
  }

  addToCart(
    currentCart: TmaCart,
    appointmentId?: string,
    installationAddress?: RelatedPlaceRef | GeographicAddress,
    msisdnValue?: Reservation
  ): void {
    const installationAddressId = installationAddress
      ? installationAddress.id
      : undefined;
    let shoppingCart: TmaTmfShoppingCart;
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    if (this.bpoCode) {
      shoppingCart = this.addBpoToCart(
        currentCart,
        appointmentId,
        currentUserId,
        installationAddressId
      );
      this.tmaTmfCartService.updateCart(shoppingCart);
      this.modalService.dismissActiveModal("close appointment component");

      this.prepareDataForModal(currentCart);
      this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
    } else {
      shoppingCart = this.addSpoToCart(
        currentCart,
        appointmentId,
        currentUserId,
        installationAddressId,
        msisdnValue
      );
      this.tmaTmfCartService.updateCart(shoppingCart);
      const newEntry$: Observable<TmaOrderEntry> = this.activeCartService.getSpoWithHighestEntryNumber(
        this.productOfferingCodes[0]
      );

      newEntry$
        .pipe(
          take(2),
          filter((newEntry: TmaOrderEntry) => !!newEntry),
          last()
        )
        .subscribe((newEntry: TmaOrderEntry) => {
          this.increment = newEntry.quantity > 1;
          this.modalService.closeActiveModal("close stepper component");
          this.openAddToCartModal(newEntry$);
        });
    }
  }

  addSpoToCart(
    currentCart: TmaCart,
    appointmentId: string,
    currentUserId: string,
    installationAddress: string,
    msisdnValue: Reservation
  ): TmaTmfShoppingCart {
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
      id: currentCart.code,
      guid: currentUserId === OCC_USER_ID_ANONYMOUS ? currentCart.guid : null,
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          action: TmaTmfActionType.ADD,
          processType: {
            id: TmaProcessTypeEnum.ACQUISITION,
          },
          productOffering: {
            id: this.productOfferingCodes[0],
          },
          quantity: this.quantity,
          appointment: this.populateAppointmentForAddEntry(
            this.productOfferingCodes[0],
            appointmentId
          ),
          product: this.populateTmfProductForAddEntry(
            this.productOfferingCodes[0],
            msisdnValue,
            installationAddress
          ),
        },
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    return shoppingCart;
  }

  addBpoToCart(
    currentCart: TmaCart,
    appointmentId: string,
    currentUserId: string,
    installationAddress: string
  ): TmaTmfShoppingCart {
    const shoppingCart: TmaTmfShoppingCart = {
      id: currentCart.code,
      guid: currentUserId === OCC_USER_ID_ANONYMOUS ? currentCart.guid : null,
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          processType: {
            id: TmaProcessTypeEnum.ACQUISITION,
          },
          productOffering: {
            id: this.bpoCode,
          },
          quantity: 1,
          cartItem: this.createCartItemList(
            this.parentBpo.children,
            appointmentId,
            installationAddress
          )
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    return shoppingCart;
  }

  

  getchecklistActionType_Appointment(): string {
    return CHECKLIST_ACTION_TYPE_APPOINTMENT;
  }

  getChecklistActionTypeMsisdn(): string {
    return CHECKLIST_ACTION_TYPE_MSISDN;
  }

  getChecklistActionTypeInstallationAddress(): string {
    return CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS;
  }

  setLogicalResourceError(event: string) {
    this.logicalResourceError = event;
  }

  onMsisdnSelection({ msisdnSelection }: { msisdnSelection: boolean }) {
    this.isMsisdnSelected = msisdnSelection;
  }

  getInputAddress(): GeographicAddress {
    const user: TmaTmfRelatedParty = {
      id: "",
    };
    this.addressError = false;
    this.geographicAddressService.clearGeographicAddressError();
    user.id = this.currentUser.uid;
    const address: GeographicAddress = {};
    address.relatedParty = user;
    address.isShippingAddress = false;
    address.isInstallationAddress = true;
    address.streetName =
      this.installationAddressForm["controls"].installationAddress["controls"]
        .buildingNumber.value +
      "," +
      this.installationAddressForm["controls"].installationAddress["controls"]
        .streetName.value;
    address.streetNr = this.installationAddressForm[
      "controls"
    ].installationAddress["controls"].apartmentNumber.value;
    address.postcode = this.installationAddressForm[
      "controls"
    ].installationAddress["controls"].postalCode.value;
    address.city = this.installationAddressForm["controls"].installationAddress[
      "controls"
    ].city.value;
    address.stateOfProvince =
      this.installationAddressForm["controls"].installationAddress["controls"]
        .region.value["isocode"] !== null
        ? this.installationAddressForm["controls"].installationAddress[
            "controls"
          ].region.value["isocode"]
        : null;
    address.country = this.installationAddressForm[
      "controls"
    ].installationAddress["controls"].country.value["isocode"];
    return address;
  }

  updateInstallationAddress(tabSet: NgbTabset, tabId: string): void {
    this.geographicAddressService.updateGeographicAddress(
      this.currentBaseSiteId,
      this.currentAddress.id,
      this.getInputAddress()
    );
    this.hasGeographicAddressError(tabSet, tabId);
  }

  createInstallationAddress(tabSet?: NgbTabset, tabId?: string): void {
    this.geographicAddressService.createGeographicAddress(
      this.currentBaseSiteId,
      this.getInputAddress()
    );
    this.hasGeographicAddressError(tabSet, tabId);
  }

  hasGeographicAddressError(tabSet: NgbTabset, tabId: string): void {
    this.geographicAddressService
      .hasGeographicAddressError()
      .pipe(
        take(2),
        filter((result: boolean) => result !== undefined),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: boolean) => {
        this.addressError = result;
        if (!this.addressError && tabSet) {
          tabSet.select(tabId);
          this.currentAddress = undefined;
        }
      });
  }

  getAddressForm(form: FormGroup): void {
    this.installationAddressForm = form;
  }

  update(currentCart: TmaCart): void {
    if (this.currentAddress) {
      this.geographicAddressService.updateGeographicAddress(
        this.currentBaseSiteId,
        this.currentAddress.id,
        this.getInputAddress()
      );

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
          filter((result) => Object.keys(result).length !== 0),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: GeographicAddress) => {
          if (this.currentAppointmentId === undefined) {
            this.updateToCart(currentCart, undefined, result.id);
          }
          this.closeModal();
        });
    }
    if (this.currentAppointmentId) {
      this.tmfAppointmentService.updateAppointment(
        this.cartEntries[0].appointment.id
      );
      const selectedTimeSlot = this.getTimeSlot();
      if (
        this.cartEntries[0].appointment.id === "CALL_TO_SCHEDULE" ||
        selectedTimeSlot.id === "CALL_TO_SCHEDULE"
      ) {
        this.tmfAppointmentService
          .getCreateAppointmentError()
          .pipe(
            take(2),
            filter((result: string) => result != null),
            takeUntil(this.destroyed$)
          )
          .subscribe((result: string) => {
            this.errPatch = result;
            return;
          });

        this.tmfAppointmentService
          .getCreatedAppointment()
          .pipe(
            take(2),
            filter((result) => Object.keys(result).length !== 0),
            takeUntil(this.destroyed$)
          )
          .subscribe((result: Appointment) => {
            const appointmentId = result.id;
            const installationPlace = result.relatedPlace
              ? result.relatedPlace.id
              : undefined;
            this.updateToCart(currentCart, appointmentId, installationPlace);
            this.closeModal();
          });
      } else {
        this.tmfAppointmentService
          .getUpdateAppointmentError(this.cartEntries[0].appointment.id)
          .pipe(
            take(2),
            filter((result: string) => !!result),
            takeUntil(this.destroyed$)
          )
          .subscribe((result: string) => {
            this.errPatch = result;
            return;
          });
        this.tmfAppointmentService
          .getAppointmentById(this.cartEntries[0].appointment.id)
          .pipe(
            take(2),
            filter((result: Appointment) => !!result),
            last(),
            takeUntil(this.destroyed$)
          )
          .subscribe((result: Appointment) => {
            const appointmentId = result.id;
            const installationPlace = result.relatedPlace
              ? result.relatedPlace.id
              : undefined;
            this.updateToCart(currentCart, appointmentId, installationPlace);
            this.closeModal();
          });
      }
    }
  }

  updateToCart(
    currentCart: TmaCart,
    appointmentId?: string,
    installationAddress?: string
  ): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: this.createUpdateCartItemList(
        currentCart,
        appointmentId,
        installationAddress
      ),
      relatedParty: [
        {
          id: currentUserId,
        },
      ],
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  selectedTimeSlot(timeSlot: TimeSlot): void {
    if (this.currentAppointmentId) {
      if (
        timeSlot.id === this.currentAppointmentId ||
        this.currentSelectedStartDate ===
          (timeSlot.validFor !== undefined
            ? timeSlot.validFor.startDateTime
            : undefined)
      ) {
        this.timeSlotChanged = false;
        return;
      }
      this.tmaSearchTimeSlotService.setSelectedTimeSlot(timeSlot);
      this.timeSlotChanged = true;
      return;
    }
    this.tmaSearchTimeSlotService.setSelectedTimeSlot(timeSlot);
  }

  protected addToCartWithMsisdnReservation(currentCart: TmaCart): void {
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
    this.logicalResourceReservationService
      .getCreatedReservation()
      .pipe(
        take(2),
        filter((result: Reservation) => Object.keys(result).length !== 0),
        takeUntil(this.destroyed$)
      )
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
        this.addToCart(currentCart, undefined, undefined, result);
      });
  }

  protected populateTmfProductForAddEntry(
    productId: string,
    msisdnValue: Reservation,
    addressId: string
  ): TmfProduct {
    return {
      place: this.populateInstallationAddressForAddEntry(productId, addressId),
      characteristic: this.populateMsisdnForAddEntry(productId, msisdnValue),
    };
  }


  protected populateMsisdnForAddEntry(
    productId: string,
    msisdnValue: Reservation
  ): TmfProductCharacteristic[] {
    if (!this.msisdnProducts.includes(productId) && !msisdnValue) {
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

  protected populateAppointment(
    id: string,
    hasAppointmentForEntry?: boolean
  ): Appointment {
    if (id === undefined || hasAppointmentForEntry === false) {
      return undefined;
    }
    return {
      id: id
    };
  }

  protected populateInstallationAddress(
    addressId: string,
    hasInstallationAddressForEntry?: boolean
  ): RelatedPlaceRef[] {
    if (!addressId || hasInstallationAddressForEntry === false) {
      return undefined;
    }
    return [
      {
        id: addressId,
        "@referredType": "GeographicAddress",
        role: "INSTALLATION_ADDRESS",
      },
    ];
  }

  protected openAddToCartModal(entry$: Observable<TmaOrderEntry>): void {
    this.spinner.hide();
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
      centered: true,
      size: "lg",
      keyboard: true,
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = entry$;
    modalInstance.cart$ = this.activeCartService.getActive();
    modalInstance.loaded$ = this.activeCartService.isStable();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
  }

  protected createUpdateCartItemList(
    currentCart: TmaCart,
    appointmentId?: string,
    installationAddress?: string
  ): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    this.cartEntries.forEach((entry: TmaOrderEntry) => {
      cartItemList.push({
        id: currentCart.code + "_" + entry.entryNumber,
        appointment: this.populateAppointment(appointmentId),
        product: {
          place: this.populateInstallationAddress(
            installationAddress,
            this.hasInstallationAddressForEntry(entry)
          ),
        },
      });
    });
    return cartItemList;
  }

  protected hasInstallationAddressForEntry(entry: TmaOrderEntry): boolean {
    if (entry.subscribedProduct && entry.subscribedProduct.place) {
      const installationAddress: TmaPlace = entry.subscribedProduct.place.find(
        (place: TmaPlace) => {
          return place.role === TmaPlaceRole.INSTALLATION_ADDRESS;
        }
      );

      return installationAddress !== undefined;
    }
    return false;
  }

  protected prepareDataForModal(currentCart: TmaCart): void {
    this.activeCartService
      .getActive()
      .pipe(
        first(
          (cart: TmaCart) =>
            cart &&
            cart.entries &&
            cart.entries.length >
              (currentCart && currentCart.entries
                ? currentCart.entries.length
                : 0)
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe((newCart: TmaCart) => {
        const newlyAddedEntries: TmaOrderEntry[] = this.tmaTmfCartService.getNewlyAddedEntries(
          currentCart,
          newCart
        );
        const resolverAddedEntries: TmaOrderEntry[] = this.resolveEntries(
          newlyAddedEntries,
          []
        );
        if (newlyAddedEntries) {
          this.spinner.hide();
          this.openModal(resolverAddedEntries);
        }
      });
  }

  protected resolveEntries(
    items: TmaOrderEntry[],
    groupedItems: TmaOrderEntry[]
  ): TmaOrderEntry[] {
    for (const item of items) {
      item.entries
        ? this.resolveEntries(item.entries, groupedItems)
        : groupedItems.push(item);
    }
    return groupedItems;
  }

  protected openModal(entries: TmaOrderEntry[]): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(
      TmaGuidedSellingAddedToCartDialogComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      }
    );

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = new Observable(
      (subscriber: Subscriber<TmaOrderEntry>) => subscriber.next(entries[0])
    );
    modalInstance.entries = entries;
    modalInstance.parentBpo = this.parentBpo;
    modalInstance.cart$ = this.activeCartService.getActive();
    modalInstance.loaded$ = this.activeCartService.isStable();
    modalInstance.quantity = 1;
    modalInstance.increment = false;
  }

  protected createCartItemList(
    children: TmaProduct[],
    appointmentId?: string,
    installationAddress?: string
  ): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];

    children.forEach((child: TmaProduct) => {
      if (child.isBundle) {
        this.productService
          .get(child.code)
          .pipe(
            first((product: TmaProduct) => product != null),
            takeUntil(this.destroyed$)
          )
          .subscribe((product: TmaProduct) => {
            if (this.createCartItemList(product.children).length > 0) {
              cartItemList.push({
                productOffering: {
                  id: child.code,
                },
                quantity: 1,
                cartItem: this.createCartItemList(
                  product.children,
                  appointmentId,
                  installationAddress
                ),
              });
            }
          });
        return;
      }
      if (
        this.productOfferingCodes.some(
          (productOfferingCode) => productOfferingCode === child.code
        )
      ) {
        cartItemList.push({
          productOffering: {
            id: child.code,
          },
          quantity: 1,
          appointment: this.populateAppointmentForAddEntry(
            child.code,
            appointmentId
          ),
          product: {
            place: this.populateInstallationAddressForAddEntry(
              child.code,
              installationAddress
            ),
          },
        });
      }
    });
    return cartItemList;
  }

  protected populateAppointmentForAddEntry(
    productId: string,
    appointmentId: string,
    hasAppointmentForEntry?: boolean
  ): Appointment {
    if (!this.appointmentProducts.includes(productId)) {
      return undefined;
    }
    return this.populateAppointment(appointmentId, hasAppointmentForEntry);
  }

  protected populateInstallationAddressForAddEntry(
    productId: string,
    addressId: string,
    hasInstallationAddressForEntry?: boolean
  ): RelatedPlaceRef[] {
    if (!this.installationProducts.includes(productId)) {
      return undefined;
    }
    return this.populateInstallationAddress(
      addressId,
      hasInstallationAddressForEntry
    );
  }

  private getTimeSlot(): TimeSlot {
    let selectedTimeSlot: TimeSlot;
    this.tmaSearchTimeSlotService
      .getSelectedTimeSlot()
      .pipe(
        take(1),
        filter((result: TimeSlot) => !!result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: TimeSlot) => {
        selectedTimeSlot = result;
      });
    return selectedTimeSlot;
  }

  private getInstallationProducts(): string[] {
    const installationProductCodes: string[] = this.checklistActions
      .filter(
        (checklistAction: TmaChecklistAction) =>
          checklistAction.actionType ===
            CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS &&
          checklistAction.productOffering
      )
      .map((checklist: TmaChecklistAction) => checklist.productOffering[0].id);
    return installationProductCodes;
  }

  private getAppointmentProducts(): string[] {
    const appointmentProductCodes: string[] = this.checklistActions
      .filter(
        (checklistAction: TmaChecklistAction) =>
          checklistAction.actionType === CHECKLIST_ACTION_TYPE_APPOINTMENT &&
          checklistAction.productOffering
      )
      .map((checklist: TmaChecklistAction) => checklist.productOffering[0].id);
    return appointmentProductCodes;
  }

  private getMsisdnProducts(): string[] {
    const msisdnProductCodes: string[] = this.checklistActions
      .filter(
        (checklistAction: TmaChecklistAction) =>
          checklistAction.actionType === CHECKLIST_ACTION_TYPE_MSISDN &&
          checklistAction.productOffering
      )
      .map((checklist: TmaChecklistAction) => checklist.productOffering[0].id);
    return msisdnProductCodes;
  }
}
