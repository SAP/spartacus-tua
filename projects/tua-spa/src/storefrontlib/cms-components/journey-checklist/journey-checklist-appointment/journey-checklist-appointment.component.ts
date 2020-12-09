import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import { SearchTimeSlotService } from '../../../../core/search-time-slot/facade';
import { Observable, of, Subject } from 'rxjs';
import {
  SearchTimeSlot,
  TimeSlot,
  TmaOrderEntry,
  TmaCart,
  TimePeriod,
  GeographicAddress,
} from '../../../../core/model';
import { AppointmentService } from '../../../../core/appointment/facade';
import {
  User,
  UserService,
  BaseSiteService,
  CxDatePipe,
} from '@spartacus/core';
import {
  TmaTmfCartService,
  TmaActiveCartService,
  LOCAL_STORAGE,
  GeographicAddressService,
} from '../../../../core';
import { first, take, takeUntil, filter } from 'rxjs/operators';
import { ModalService } from '@spartacus/storefront';
import { JourneyChecklistConfig } from '../../../../core/journey-checklist-config/config';
import { ChangeDetectorRef } from '@angular/core';

const { CALL_TO_SCHEDULE } = LOCAL_STORAGE.APPOINTMENT;

@Component({
  selector: 'cx-journey-checklist-appointment',
  templateUrl: './journey-checklist-appointment.component.html',
  styleUrls: ['./journey-checklist-appointment.component.scss'],
})
export class JourneyChecklistAppointmentComponent
  implements AfterViewChecked, OnInit, OnDestroy {
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
  cartEntries: TmaOrderEntry[];

  @Input()
  placeRequired: boolean;

  place: GeographicAddress;
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
    protected config?: JourneyChecklistConfig,
    protected geographicAddressService?: GeographicAddressService,
    private cdRef?: ChangeDetectorRef
  ) {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.selectedAvailableTimeSlot = this.defaultTimeSlot;
    this.selectedTimeSlot(this.defaultTimeSlot);

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
        first((baseSiteId: string) => !!baseSiteId),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));

    this.timeSlotChanged = false;
    if (!this.placeRequired) {
      this.timeSlots$ = this.tmaSearchTimeSlotService.getAvailableTimeSlots();
    }
  }

  ngOnDestroy() {
    this.tmfAppointmentService.clearAppointmentState();
    this.tmfAppointmentService.clearCreatedAppointmentState();
    this.tmfAppointmentService.clearAppointmentError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  selectedTimeSlot(timeSlot: TimeSlot): void {
    this.tmaSearchTimeSlotService.setSelectedTimeSlot(timeSlot);
  }

  getrequestedNumberOfTimeSlots(): string {
    return this.config.journeyChecklist.appointment.requested_number_of_timeslots.toString();
  }

  getTimeSlots(searchSlot: SearchTimeSlot): Observable<SearchTimeSlot> {
    if (searchSlot === null) {
      if (!this.placeRequired) {
        return this.timeSlots$;
      } else {
        this.geographicAddressService
          .getSelectedInstallationAddress()
          .pipe(
            take(2),
            filter((result: GeographicAddress) => !!result),
            takeUntil(this.destroyed$)
          )
          .subscribe((result: GeographicAddress) => {
            this.place = result;
          });
        if (this.place.id) {
          this.timeSlots$ = this.tmaSearchTimeSlotService.getAvailableTimeSlots(
            this.place
          );
          return this.timeSlots$;
        }
      }
    }
    return of(searchSlot);
  }
}
