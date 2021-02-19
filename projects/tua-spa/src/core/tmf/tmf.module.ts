import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaTmfChecklistActionModule } from './adapters/checklistaction/tma-tmf-checklist-action.module';
import { TmfConfig } from './config/tmf-config';
import { AuthModule, Config, provideConfig, provideConfigValidator } from '@spartacus/core';
import { defaultTmfConfig } from './config/default-tmf-config';
import { tmfConfigValidator } from './config/tmf-config-validator';
import { TmfConfigLoaderModule } from './config-loader/tmf-config-loader.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TmaClientTokenInterceptor } from '../auth/http-interceptors/tma-client-token.interceptor';
import { TmaUserTokenInterceptor } from '../auth/http-interceptors/tma-user-token.interceptor';

@NgModule({
  imports: [
    AuthModule.forRoot(),
    TmaTmfChecklistActionModule,
    TmfConfigLoaderModule.forRoot(),
  ],
})
export class TmfModule {
  static forRoot(): ModuleWithProviders<TmfModule> {
    return {
      ngModule: TmfModule,
      providers: [
        { provide: TmfConfig, useExisting: Config },
        provideConfig(defaultTmfConfig),
        provideConfigValidator(tmfConfigValidator),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaClientTokenInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaUserTokenInterceptor,
          multi: true
        },
      ],
    };
  }
}
