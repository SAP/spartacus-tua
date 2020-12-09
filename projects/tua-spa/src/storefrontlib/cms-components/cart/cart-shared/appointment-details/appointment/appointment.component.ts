import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { AppointmentService } from '../../../../../../core';
import {
  ModalService,
  ModalRef,
  PageLayoutService,
} from '@spartacus/storefront';
import {
  TmaOrderEntry,
  Appointment,
  AppointmentStateType,
} from '../../../../../../core/model';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Page } from '@spartacus/core';

@Component({
  selector: 'cx-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentComponent implements OnInit, OnDestroy {
  @Input()
  appointmentEntries: TmaOrderEntry[];

  @Input()
  cartPage?: boolean;

  @Output()
  appointment = new EventEmitter<Appointment>();

  modalRef: ModalRef;
  appointment$: Observable<Appointment>;
  currentPageCode$: Observable<string> = this.pageService.page$.pipe(
    filter(Boolean),
    map((p: Page) => p.pageId)
  );

  constructor(
    public appointmentService: AppointmentService,
    protected modalService: ModalService,
    protected pageService: PageLayoutService
  ) {}

  ngOnInit(): void {
    this.appointment$ = this.appointmentService.getAppointmentById(
      this.appointmentEntries[0].appointment.id
    );
  }

  ngOnDestroy() {
    this.appointmentService.clearAppointmentState();
    this.appointmentService.clearCreatedAppointmentState();
    this.appointmentService.clearAppointmentError();
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
}
