import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { JourneyChecklistAppointmentComponent } from '../../../journey-checklist';
import { AppointmentDetailsComponent } from './appointment-details.component';
import { AppointmentComponentModule } from './appointment';
import { InstallationAddressComponentModule } from './installation-address';

@NgModule({
  declarations: [AppointmentDetailsComponent],
  imports: [
    CommonModule,
    I18nModule,
    AppointmentComponentModule,
    InstallationAddressComponentModule,
  ],
  exports: [AppointmentDetailsComponent],
  entryComponents: [JourneyChecklistAppointmentComponent],
})
export class AppointmentDetailsComponentModule {}
