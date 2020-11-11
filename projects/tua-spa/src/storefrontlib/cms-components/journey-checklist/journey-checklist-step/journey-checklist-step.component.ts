import {
  Appointment,
  TmaTmfCartItem,
  TmaProduct,
  LogicalResourceType,
  TmfProduct
} from '../../../../core/model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  TmaChecklistAction,
  TmaOrderEntry,
  TmaActiveCartService,
  TmaTmfCartService,
  TmaCart,
  TmaProcessTypeEnum,
  TmaTmfShoppingCart,
  TmaTmfActionType,
  Reservation,
  ReservationStateType,
  LOCAL_STORAGE
} from '../../../../core';
import { take, filter, last, first, takeUntil } from 'rxjs/operators';
import { TmaAddedToCartDialogComponent } from '../../cart/add-to-cart/added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { AppointmentService } from '../../../../core/appointment/facade';
import {
  OCC_USER_ID_ANONYMOUS,
  User,
  UserService,
  BaseSiteService,
  ProductService
} from '@spartacus/core';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  LogicalResourceReservationService,
  MsisdnReservationService
} from '../../../../core/reservation/facade';

const { CHECKLIST_ACTION_TYPE_APPOINTMENT } = LOCAL_STORAGE.APPOINTMENT;
const { CHECKLIST_ACTION_TYPE_MSISDN } = LOCAL_STORAGE.MSISDN_RESERVATION;

@Component({
  selector: 'cx-journey-checklist-step',
  templateUrl: './journey-checklist-step.component.html',
  styleUrls: ['./journey-checklist-step.component.scss'],
  providers: [NgbTabsetConfig]
})
export class JourneyChecklistStepComponent implements OnInit, OnDestroy {
  @Input()
  checklistActions: TmaChecklistAction[];

  @Input()
  productCode: string;

  @Input()
  quantity: number;

  increment = false;
  currentCart$: Observable<TmaCart>;
  error: string;
  errorResult: string;
  isMsisdnSelected: boolean;
  shoppingCart: TmaTmfShoppingCart;
  msisdnValueSelected: string;
  logicalResourceError: any;
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected modalRef: ModalRef;
  protected destroyed$ = new Subject();

  constructor(
    config: NgbTabsetConfig,
    protected modalService: ModalService,
    protected activeCartService: TmaActiveCartService,
    protected baseSiteService: BaseSiteService,
    protected appointmentService: AppointmentService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected userService: UserService,
    protected spinner: NgxSpinnerService,
    protected logicalResourceReservationService: LogicalResourceReservationService,
    protected productService: ProductService,
    protected msisdnReservationService: MsisdnReservationService
  ) {
    // customize default values of tabsets used by this component tree
    config.justify = 'center';
    config.type = 'pills';
  }

  ngOnInit() {
    this.isMsisdnSelected = false;
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
  }

  ngOnDestroy() {
    this.appointmentService.clearAppointmentState();
    this.appointmentService.clearCreatedAppointmentState();
    this.appointmentService.clearAppointmentError();
    this.logicalResourceReservationService.clearCreatedReservationState();
    this.logicalResourceReservationService.clearReservationError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  closeModal(): void {
    this.modalService.dismissActiveModal('close stepper component');
  }

  submit(currentCart: TmaCart): void {
    this.spinner.show();
    this.addCartEntryWithChecklistActions(currentCart);
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
        this.increment = newEntry.quantity > 1;
        this.modalService.closeActiveModal('close stepper component');
        this.openAddToCartModal(newEntry$);
      });
  }

  addCartEntryWithChecklistActions(currentCart: TmaCart): void {
    let appointmentRequired = false;
    let msisdnRequired = false;
    this.checklistActions.forEach((checklistAction: TmaChecklistAction) => {
      if (checklistAction.actionType === CHECKLIST_ACTION_TYPE_APPOINTMENT) {
        appointmentRequired = true;
        this.appointmentService.createAppointmentForTimeSlot();
      }
      if (checklistAction.actionType === LogicalResourceType.MSISDN) {
        msisdnRequired = true;
        this.productService
          .get(this.productCode)
          .pipe(
            first((product: TmaProduct) => product != null),
            takeUntil(this.destroyed$)
          )
          .subscribe((product: TmaProduct) => {
            this.msisdnReservationService.createReservationForMsisdn(product);
          });
      }
    });
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
          this.addToCart(currentCart, result.id, undefined);
        });
    }
    if (msisdnRequired) {
      this.addToCartWithMsisdnReservation(currentCart);
    }
  }

  addToCart(
    currentCart: TmaCart,
    appointmentId: string,
    msisdnValue: Reservation
  ): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
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
      cartItem: this.createCartItemList(appointmentId, msisdnValue),
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  getchecklistActionType_Appointment(): string {
    return CHECKLIST_ACTION_TYPE_APPOINTMENT;
  }

  getChecklistActionTypeMsisdn(): string {
    return CHECKLIST_ACTION_TYPE_MSISDN;
  }

  setLogicalResourceError(event: string) {
    this.logicalResourceError = event;
  }

  onMsisdnSelection({ msisdnSelection }: { msisdnSelection: boolean }) {
    this.isMsisdnSelected = msisdnSelection;
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
          result.reservationState ===
          (ReservationStateType.REJECTED || ReservationStateType.CANCELLED)
        ) {
          this.spinner.hide();
          this.errorResult = result.reservationState;
          return;
        }
        this.addToCart(currentCart, undefined, result);
      });
  }

  protected createCartItemList(
    appointmentId: string,
    msisdnValue: Reservation
  ): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    cartItemList.push({
      action: TmaTmfActionType.ADD,
      processType: {
        id: TmaProcessTypeEnum.ACQUISITION
      },
      productOffering: {
        id: this.productCode
      },
      appointment: this.populateAppointment(appointmentId),
      product: this.populateTmfProduct(msisdnValue),
      quantity: this.quantity
    });
    return cartItemList;
  }

  protected populateTmfProduct(msisdnValue: Reservation): TmfProduct {
    if (!msisdnValue) {
      return undefined;
    }
    return {
      characteristic: [
        {
          id: msisdnValue.id,
          name: LogicalResourceType.MSISDN,
          value: this.msisdnValueSelected
        }
      ]
    };
  }

  protected populateAppointment(id: string): Appointment {
    if (id === undefined) {
      return undefined;
    }
    return {
      id: id
    };
  }

  protected openAddToCartModal(entry$: Observable<TmaOrderEntry>): void {
    this.spinner.hide();
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
      centered: true,
      size: 'lg',
      keyboard: true
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = entry$;
    modalInstance.cart$ = this.activeCartService.getActive();
    modalInstance.loaded$ = this.activeCartService.getLoaded();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
  }
}
