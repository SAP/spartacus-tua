import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig } from '@spartacus/core';
import { DeliveryModeConfig, defaultDeliveryModeConfig } from './config';

@NgModule({})
export class DeliveryModeConfigModule {
  static forRoot(): ModuleWithProviders<DeliveryModeConfigModule> {
    return {
      ngModule: DeliveryModeConfigModule,
      providers: [
        { provide: DeliveryModeConfig, useExisting: Config },
        provideConfig(defaultDeliveryModeConfig)
      ]
    };
  }
}
