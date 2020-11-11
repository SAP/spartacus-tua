import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig } from '@spartacus/core';
import { TmaBillingFrequencyConfig } from './config';
import { TmaBillingFrequencyConfigLoaderModule } from './config-loader/index';
import { defaultTmaBillingFrequencyConfig } from './config/default-tma-billing-frequency-config';

@NgModule({
  imports: [
    TmaBillingFrequencyConfigLoaderModule.forRoot()
  ]
})
export class TmaBillingFrequencyConfigModule {
  static forRoot(): ModuleWithProviders<TmaBillingFrequencyConfigModule> {
    return {
      ngModule: TmaBillingFrequencyConfigModule,
      providers: [
        { provide: TmaBillingFrequencyConfig, useExisting: Config },
        provideConfig(defaultTmaBillingFrequencyConfig)
      ]
    };
  }
}
