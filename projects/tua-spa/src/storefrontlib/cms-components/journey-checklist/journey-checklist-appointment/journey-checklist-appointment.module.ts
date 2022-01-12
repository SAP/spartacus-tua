import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CxDatePipe } from '@spartacus/core';
import { JourneyChecklistAppointmentFormModule } from './journey-checklist-appointment-form';
import { JourneyChecklistAppointmentDisplayModule } from './journey-checklist-appointment-display';

@NgModule({
  imports: [
    CommonModule,
    JourneyChecklistAppointmentFormModule,
    JourneyChecklistAppointmentDisplayModule
  ],
  providers: [CxDatePipe],
  declarations: [],
  entryComponents: [],
  exports: []
})
export class JourneyChecklistAppointmentModule {
}
