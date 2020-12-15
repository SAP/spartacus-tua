import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneyChecklistAppointmentComponent } from './journey-checklist-appointment/journey-checklist-appointment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule, CxDatePipe } from '@spartacus/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JourneyChecklistInstallationAddressComponent } from './journey-checklist-installation-address/journey-checklist-installation-address.component';
import { JourneyChecklistStepComponent } from './journey-checklist-step/journey-checklist-step.component';
import { JourneyChecklistLogicalResourceComponent } from './journey-checklist-logical-resource/journey-checklist-logical-resource.component';
import { TmaAddressFormModule } from '../address-form';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    NgbModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    TmaAddressFormModule
  ],
  providers: [CxDatePipe],
  declarations: [
    JourneyChecklistStepComponent,
    JourneyChecklistAppointmentComponent,
    JourneyChecklistInstallationAddressComponent,
    JourneyChecklistLogicalResourceComponent,
  ],
  entryComponents: [
    JourneyChecklistStepComponent,
    JourneyChecklistAppointmentComponent,
    JourneyChecklistInstallationAddressComponent,
    JourneyChecklistLogicalResourceComponent,
  ],
  exports: [
    JourneyChecklistStepComponent,
    JourneyChecklistAppointmentComponent,
    JourneyChecklistInstallationAddressComponent,
    JourneyChecklistLogicalResourceComponent,
  ],
})
export class JourneyChecklistComponentModule {}
