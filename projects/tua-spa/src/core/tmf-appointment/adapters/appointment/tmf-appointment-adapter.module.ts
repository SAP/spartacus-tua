import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppointmentAdapter } from '../../../appointment/store';
import { TmfAppointmentAdapter } from './tmf-appointment.adapter';
import { defaultTmfAppointmentAdapterConfig } from './default-tmf-appointment-adapter-config';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfAppointmentAdapterConfig),
  ],
  providers: [
    {
      provide: AppointmentAdapter,
      useClass: TmfAppointmentAdapter,
    },
  ],
})
export class TmfAppointmentAdapterModule {}
