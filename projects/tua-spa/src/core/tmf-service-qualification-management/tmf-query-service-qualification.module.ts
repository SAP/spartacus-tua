import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig, provideConfigValidator } from '@spartacus/core';
import { TmaClientTokenInterceptor, TmaUserTokenInterceptor } from '../auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  tmfQueryServiceQualificationConfigValidator,
  TmfQueryServiceQualificationConfig,
  defaultTmfQueryServiceQualificationConfig
} from './config';
import { TmfQueryServiceQualificationAdapterModule } from './adapters';

@NgModule({
  imports: [TmfQueryServiceQualificationAdapterModule]
})
export class TmfQueryServiceQualificationModule {
  static forRoot(): ModuleWithProviders<TmfQueryServiceQualificationModule> {
    return {
      ngModule: TmfQueryServiceQualificationModule,
      providers: [
        { provide: TmfQueryServiceQualificationConfig, useExisting: Config },

        provideConfig(defaultTmfQueryServiceQualificationConfig),
        provideConfigValidator(tmfQueryServiceQualificationConfigValidator),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaClientTokenInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaUserTokenInterceptor,
          multi: true
        }
      ]
    };
  }
}