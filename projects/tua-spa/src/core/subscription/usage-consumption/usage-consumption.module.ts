import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageConsumptionService } from './facade';
import { UsageConsumptionStoreModule } from './store/usage-consumption.store.module';

@NgModule({
  imports: [CommonModule, UsageConsumptionStoreModule],
})
export class UsageConsumptionModule {
  static forRoot(): ModuleWithProviders<UsageConsumptionModule> {
    return {
      ngModule: UsageConsumptionModule,
      providers: [UsageConsumptionService],
    };
  }
}
