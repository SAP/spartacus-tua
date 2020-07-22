import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, defaultOccConfig, OccConfig, occConfigValidator, provideConfig, provideConfigValidator } from '@spartacus/core';
import { TmaOccCartModule } from './adapters/cart';

@NgModule({
  imports: [
    TmaOccCartModule
  ],
})
export class TmaOccModule {
  static forRoot(): ModuleWithProviders<TmaOccModule> {
    return {
      ngModule: TmaOccModule,
      providers: [
        { provide: OccConfig, useExisting: Config },
        provideConfig(defaultOccConfig),
        provideConfigValidator(occConfigValidator),
      ],
    };
  }
}
