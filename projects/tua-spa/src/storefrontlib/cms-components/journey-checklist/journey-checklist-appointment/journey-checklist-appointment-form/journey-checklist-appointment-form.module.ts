import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule, CxDatePipe } from '@spartacus/core';
import { JourneyChecklistAppointmentFormComponent } from './journey-checklist-appointment-form.component';
import { TmaAddressFormModule } from '../../../address-form';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

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
  declarations: [JourneyChecklistAppointmentFormComponent],
  providers: [CxDatePipe],
  exports: [JourneyChecklistAppointmentFormComponent],
  entryComponents: [JourneyChecklistAppointmentFormComponent]
})
export class JourneyChecklistAppointmentFormModule {
}
