import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneyChecklistAppointmentComponent } from './journey-checklist-appointment/journey-checklist-appointment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { I18nModule, CxDatePipe } from '@spartacus/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JourneyChecklistStepComponent } from './journey-checklist-step/journey-checklist-step.component';
import { JourneyChecklistLogicalResourceComponent } from './journey-checklist-logical-resource/journey-checklist-logical-resource.component';

@NgModule({
  imports: [CommonModule, I18nModule, NgbModule, FormsModule, NgxSpinnerModule],
  providers: [CxDatePipe],
  declarations: [
    JourneyChecklistStepComponent,
    JourneyChecklistAppointmentComponent,
    JourneyChecklistLogicalResourceComponent
  ],
  entryComponents: [
    JourneyChecklistStepComponent,
    JourneyChecklistAppointmentComponent
  ],
  exports: [
    JourneyChecklistStepComponent,
    JourneyChecklistAppointmentComponent
  ]
})
export class JourneyChecklistComponentModule {
}

