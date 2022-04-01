import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { AppointmentService, SearchTimeSlotService } from '../../../../../core';
import {
  ModalService,
  ModalRef,
  PageLayoutService
} from '@spartacus/storefront';
import {
  TmaOrderEntry,
  Appointment,
  AppointmentStateType,
  RelatedPlaceRefOrValue
} from '../../../../../core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Page } from '@spartacus/core';
import { JourneyChecklistAppointmentFormComponent } from '../journey-checklist-appointment-form';

@Component({
  selector: 'cx-journey-checklist-appointment-display',
  templateUrl: './journey-checklist-appointment-display.component.html',
  styleUrls: ['./journey-checklist-appointment-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JourneyChecklistAppointmentDisplayComponent
  implements AfterViewChecked, OnInit, OnDestroy {
  @Input()
  showEdit: boolean;

  @Input()
  addAppointment: boolean;

  @Input()
  item?: TmaOrderEntry;

  @Output()
  appointment = new EventEmitter<Appointment>();

  modalRef: ModalRef;
  appointment$: Observable<Appointment>;

  currentPageCode$: Observable<string> = this.pageService.page$.pipe(
    filter(Boolean),
    map((p: Page) => p.pageId)
  );

  errorMessage: Observable<string>;
  protected destroyed$ = new Subject();

  constructor(
    public appointmentService: AppointmentService,
    public searchTimeSlotService: SearchTimeSlotService,
    protected modalService: ModalService,
    protected pageService: PageLayoutService,
    private cdRef?: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.item && this.item.appointment) {
      this.appointment$ = this.appointmentService.getAppointmentById(
        this.item.appointment.id
      );
      this.errorMessage = this.appointmentService.getAppointmentErrorForID(
        this.item.appointment.id
      );
    }
  }

  ngOnDestroy() {
    this.appointmentService.clearAppointmentState();
    this.appointmentService.clearCreatedAppointmentState();
    this.appointmentService.clearAppointmentError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getAppointmentStateType(): AppointmentStateType {
    return AppointmentStateType.CANCELLED;
  }

  getAppointment(appointment: Appointment): Appointment {
    if (appointment) {
      this.appointment.emit(appointment);
      return appointment;
    }
    return undefined;
  }

  /**
   * Opens {@link JourneyChecklistAppointmentFormComponent} passing the necessary data
   *
   * @param appointment of {@link Appointment}
   * @param selectedTimeSlotPlace of {@link RelatedPlaceRefOrValue}
   */
  updateAppointment(
    appointment?: Appointment,
    selectedTimeSlotPlace?: RelatedPlaceRefOrValue
  ): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(
      JourneyChecklistAppointmentFormComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: true
      }
    );
    modalInstance = this.modalRef.componentInstance;
    modalInstance.isEdit = appointment ? true : false;
    modalInstance.currentAppointmentId = appointment
      ? appointment.id
      : undefined;
    modalInstance.item = this.item;
    modalInstance.currentAppointment = appointment;
    modalInstance.selectedTimeSlotPlace = selectedTimeSlotPlace;
  }
}
