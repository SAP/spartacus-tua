import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AppointmentService, LOCAL_STORAGE } from '../../../../../core';
import { JourneyChecklistStepComponent } from '../../../journey-checklist';
import {
  ModalService,
  ModalRef,
  PageLayoutService,
} from '@spartacus/storefront';
import {
  TmaOrderEntry,
  Appointment,
  TmaPlace,
  TmaChecklistAction,
  TmaPlaceRole,
} from '../../../../../core/model';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Page } from '@spartacus/core';
const { CHECKLIST_ACTION_TYPE_APPOINTMENT } = LOCAL_STORAGE.APPOINTMENT;
const {
  CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS,
} = LOCAL_STORAGE.INSTALLATION_ADDRESS;

@Component({
  selector: 'cx-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentDetailsComponent implements OnInit {
  @Input()
  cartPage: boolean;

  @Input()
  groupItems: TmaOrderEntry[];

  appointment: Appointment;
  appointmentEntries: TmaOrderEntry[];
  installationAddressEntries: TmaOrderEntry[];
  modalRef: ModalRef;
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
    this.appointmentEntries = this.getItemsWithAppointment(this.groupItems);
    this.installationAddressEntries = this.getItemsWithInstallationAddress(
      this.groupItems
    );
  }

  getItemsWithAppointment(groupItems: TmaOrderEntry[]): TmaOrderEntry[] {
    let filteredEntries: TmaOrderEntry[];
    filteredEntries = groupItems.filter(
      (item: TmaOrderEntry) => item.appointment != null
    );
    return filteredEntries;
  }

  getItemsWithInstallationAddress(
    groupItems: TmaOrderEntry[]
  ): TmaOrderEntry[] {
    let filteredEntries: TmaOrderEntry[];
    filteredEntries = groupItems.filter(
      (item: TmaOrderEntry) =>
        item.subscribedProduct !== undefined &&
        item.subscribedProduct.place !== undefined &&
        this.itemHasInstallationAddress(item)
    );
    return filteredEntries;
  }

  edit(installationAddress: TmaPlace, appointment: Appointment): void {
    let stepModalIns: any;
    this.modalRef = this.modalService.open(JourneyChecklistStepComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
    });
    stepModalIns = this.modalRef.componentInstance;
    stepModalIns.isEdit = true;
    const checkLists: TmaChecklistAction[] = [];
    if (installationAddress) {
      stepModalIns.currentAddress = installationAddress;
      checkLists.push({
        actionType: CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS,
      });
    }
    if (appointment) {
      checkLists.push({ actionType: CHECKLIST_ACTION_TYPE_APPOINTMENT });
    }
    stepModalIns.checklistActions = checkLists;
    stepModalIns.currentAppointmentId = appointment
      ? appointment.id
      : undefined;
    if (appointment !== undefined) {
      stepModalIns.currentSelectedStartDate = appointment.validFor
        ? appointment.validFor.startDateTime
        : undefined;
    }
    stepModalIns.currentSelectedTimePeriod =
      appointment !== undefined ? appointment.validFor : undefined;
    stepModalIns.cartEntries = this.appointmentEntries;
  }

  getAppointment(appointment: Appointment): void {
    if (appointment) {
      this.appointment = appointment;
    }
  }

  private itemHasInstallationAddress(item: TmaOrderEntry): boolean {
    const hasInstallationAddress: TmaPlace = item.subscribedProduct.place.find(
      (address: TmaPlace) => address.role === TmaPlaceRole.INSTALLATION_ADDRESS
    );
    return hasInstallationAddress !== undefined;
  }
}
