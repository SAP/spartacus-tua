import { NgModule, ModuleWithProviders } from '@angular/core';
import { AvailabilityCheckService } from './facade';
import { AvailabilityCheckStoreModule } from './store/availability-check-store.module';

@NgModule({
  imports: [AvailabilityCheckStoreModule]
})
export class AvailabilityCheckModule {
  static forRoot(): ModuleWithProviders<AvailabilityCheckModule> {
    return {
      ngModule: AvailabilityCheckModule,
      providers: [AvailabilityCheckService]
    };
  }
}
