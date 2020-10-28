import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppointmentComponent } from './appointment.component';
import { I18nModule } from '@spartacus/core';
import { JourneyChecklistAppointmentComponent } from '../../../journey-checklist/journey-checklist-appointment/journey-checklist-appointment.component';

@NgModule({
  declarations: [AppointmentComponent],
  imports: [CommonModule, I18nModule],
  exports: [AppointmentComponent],
  entryComponents: [JourneyChecklistAppointmentComponent],
})
export class AppointmentComponentModule {}
