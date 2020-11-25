import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppointmentService } from './facade';
import { AppointmentStoreModule } from './store/appointment-store.module';

@NgModule({
  imports: [AppointmentStoreModule],
})
export class AppointmentModule {
  static forRoot(): ModuleWithProviders<AppointmentModule> {
    return {
      ngModule: AppointmentModule,
      providers: [AppointmentService],
    };
  }
}
