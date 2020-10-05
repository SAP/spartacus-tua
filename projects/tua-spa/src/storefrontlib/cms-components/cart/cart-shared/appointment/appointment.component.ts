import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { AppointmentService } from '../../../../../core/appointment/facade';
import { JourneyChecklistAppointmentComponent } from '../../../journey-checklist/journey-checklist-appointment/journey-checklist-appointment.component';
import {
  ModalService,
  ModalRef,
  PageLayoutService,
} from '@spartacus/storefront';
import {
  TmaOrderEntry,
  Appointment,
  AppointmentStateType,
} from '../../../../../core/model';
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
  item: TmaOrderEntry;
  @Input()
  cartPage: boolean;
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
      this.item.appointment.id
    );
  }

  ngOnDestroy() {
    this.appointmentService.clearAppointmentState();
    this.appointmentService.clearCreatedAppointmentState();
    this.appointmentService.clearAppointmentError();
  }

  edit(appointmentRef: Appointment) {
    let stepModalIns: any;
    this.modalRef = this.modalService.open(
      JourneyChecklistAppointmentComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: true,
      }
    );
    stepModalIns = this.modalRef.componentInstance;
    stepModalIns.isEdit = true;
    stepModalIns.currentAppointmentId = this.item.appointment.id;
    if (appointmentRef !== undefined) {
      stepModalIns.currentSelectedStartDate = appointmentRef.validFor
        ? appointmentRef.validFor.startDateTime
        : undefined;
    }
    stepModalIns.currentSelectedTimePeriod =
      appointmentRef !== undefined ? appointmentRef.validFor : undefined;
    stepModalIns.cartEntry = this.item;
  }
  getappointmentStateType(): AppointmentStateType {
    return AppointmentStateType.CANCELLED;
  }
}
