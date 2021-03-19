import { NgModule } from '@angular/core';
import { CxDatePipe } from '@spartacus/core';
import { JourneyChecklistInstallationAddressModule } from './journey-checklist-installation-address';
import { JourneyChecklistLogicalResourceModule } from './journey-checklist-logical-resource';
import { JourneyChecklistAppointmentModule } from './journey-checklist-appointment';

@NgModule({
  imports: [
    JourneyChecklistLogicalResourceModule,
    JourneyChecklistInstallationAddressModule,
    JourneyChecklistAppointmentModule
  ],
  providers: [CxDatePipe],
  declarations: [],
  entryComponents: [],
  exports: []
})
export class JourneyChecklistComponentModule {}
