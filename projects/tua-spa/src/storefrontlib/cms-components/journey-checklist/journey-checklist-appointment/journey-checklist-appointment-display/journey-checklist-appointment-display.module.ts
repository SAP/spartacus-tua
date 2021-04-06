import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JourneyChecklistAppointmentDisplayComponent } from './journey-checklist-appointment-display.component';
import { I18nModule, CxDatePipe } from '@spartacus/core';
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
  declarations: [JourneyChecklistAppointmentDisplayComponent],
  providers: [CxDatePipe],
  exports: [JourneyChecklistAppointmentDisplayComponent],
  entryComponents: [JourneyChecklistAppointmentDisplayComponent]
})
export class JourneyChecklistAppointmentDisplayModule {
}
