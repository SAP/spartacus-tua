import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  Config,
  defaultOccConfig,
  OccConfig,
  occConfigValidator,
  OccModule,
  provideConfig,
  provideConfigValidator
} from '@spartacus/core';
import { TmaOccCartModule } from './adapters/cart';
import { TmaOccProductModule } from './adapters/product';

@NgModule({
  imports: [
    TmaOccCartModule,
    TmaOccProductModule
  ]
})
export class TmaOccModule extends OccModule {
  static forRoot(): ModuleWithProviders<TmaOccModule> {
    return {
      ngModule: TmaOccModule,
      providers: [
        { provide: OccConfig, useExisting: Config },
        provideConfig(defaultOccConfig),
        provideConfigValidator(occConfigValidator)
      ]
    };
  }
}
