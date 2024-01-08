import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppointmentComponent } from './appointment.component';
import { I18nModule } from '@spartacus/core';

@NgModule({
  declarations: [AppointmentComponent],
  imports: [CommonModule, I18nModule],
  exports: [AppointmentComponent],
  entryComponents: [],
})
export class AppointmentComponentModule {}
