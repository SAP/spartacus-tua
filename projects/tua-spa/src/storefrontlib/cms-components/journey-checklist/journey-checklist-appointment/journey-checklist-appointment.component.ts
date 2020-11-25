import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SearchTimeSlotService } from '../../../../core/search-time-slot/facade';
import { Observable, Subject } from 'rxjs';
import {
  SearchTimeSlot,
  TimeSlot,
  TmaOrderEntry,
  TmaCart,
  TmaTmfShoppingCart,
  TimePeriod,
  Appointment,
} from '../../../../core/model';
import { AppointmentService } from '../../../../core/appointment/facade';
import {
  User,
  UserService,
  OCC_USER_ID_ANONYMOUS,
  BaseSiteService,
  CxDatePipe,
} from '@spartacus/core';
import {
  TmaTmfCartService,
  TmaActiveCartService,
  LOCAL_STORAGE,
} from '../../../../core';
import { first, last, take, filter, takeUntil } from 'rxjs/operators';
import { ModalService } from '@spartacus/storefront';
import { JourneyChecklistConfig } from '../../../../core/journey-checklist-config/config';

const { CALL_TO_SCHEDULE } = LOCAL_STORAGE.APPOINTMENT;

@Component({
  selector: 'cx-journey-checklist-appointment',
  templateUrl: './journey-checklist-appointment.component.html',
  styleUrls: ['./journey-checklist-appointment.component.scss'],
})
export class JourneyChecklistAppointmentComponent implements OnInit, OnDestroy {
  @Input()
  checkListLengthApp: number;

  @Input()
  isEdit: boolean;

  @Input()
  currentAppointmentId: string;

  @Input()
  currentSelectedStartDate: Date;

  @Input()
  currentSelectedTimePeriod?: TimePeriod;

  @Input()
  cartEntry: TmaOrderEntry;

  timeSlotChanged: boolean;
  selectedAvailableTimeSlot: any = null;
  timeSlots$: Observable<SearchTimeSlot>;
  errPatch: any;
  error: string;
  defaultTimeSlot: TimeSlot = {
    id: CALL_TO_SCHEDULE,
  };
  protected currentCart: TmaCart;
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected destroyed$ = new Subject();

  constructor(
    protected tmaSearchTimeSlotService: SearchTimeSlotService,
    protected tmfAppointmentService: AppointmentService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected activeCartService: TmaActiveCartService,
    protected baseSiteService: BaseSiteService,
    protected userService: UserService,
    protected modalService: ModalService,
    protected datePipe: CxDatePipe,
    protected config?: JourneyChecklistConfig
  ) {}

  ngOnInit() {
    if (this.currentSelectedTimePeriod !== undefined) {
      const preSelectedTimeSlot: TimeSlot = {
        validFor: this.currentSelectedTimePeriod,
      };
      this.selectedAvailableTimeSlot = this.datePipe.transform(
        preSelectedTimeSlot.validFor.startDateTime,
        'MMM d, y h:mm a',
        'UTC'
      );
    } else {
      this.selectedAvailableTimeSlot = this.defaultTimeSlot;
      this.selectedTimeSlot(this.defaultTimeSlot);
    }
    this.activeCartService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((cart: TmaCart) => (this.currentCart = cart));

    this.userService
      .get()
      .pipe(
        first((user: User) => !!user),
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

    this.timeSlotChanged = false;
    this.timeSlots$ = this.tmaSearchTimeSlotService.getAvailableTimeSlots();
  }

  ngOnDestroy() {
    this.tmfAppointmentService.clearAppointmentState();
    this.tmfAppointmentService.clearCreatedAppointmentState();
    this.tmfAppointmentService.clearAppointmentError();
    this.destroyed$.next();
    this.destroyed$.complete();
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

  update(): void {
    this.tmfAppointmentService.updateAppointment(this.cartEntry.appointment.id);
    const selectedTimeSlot = this.getTimeSlot();
    if (
      this.cartEntry.appointment.id === CALL_TO_SCHEDULE ||
      selectedTimeSlot.id === CALL_TO_SCHEDULE
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
          this.updateToCart(appointmentId);
          this.closeModal();
        });
    } else {
      this.tmfAppointmentService
        .getUpdateAppointmentError(this.cartEntry.appointment.id)
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
        .getAppointmentById(this.cartEntry.appointment.id)
        .pipe(
          take(2),
          filter((result: Appointment) => !!result),
          last(),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: Appointment) => {
          const appointmentId = result.id;
          this.updateToCart(appointmentId);
          this.closeModal();
        });
    }
  }

  updateToCart(appointmentId: string): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          id:
            this.currentCart.code +
            '_' +
            this.cartEntry.entryNumber +
            '_' +
            'SPO',
          appointment: {
            id: appointmentId,
          },
        },
      ],
      relatedParty: [
        {
          id: currentUserId,
        },
      ],
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  closeModal(): void {
    this.modalService.dismissActiveModal('close appointment component');
  }

  getrequestedNumberOfTimeSlots(): string {
    return this.config.journeyChecklist.appointment.requested_number_of_timeslots.toString();
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
}
