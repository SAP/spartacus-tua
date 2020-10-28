import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaTmfChecklistActionModule } from './adapters/checklistaction';
import { TmfConfig } from './config/tmf-config';
import { Config, provideConfig, provideConfigValidator } from '@spartacus/core';
import { defaultTmfConfig } from './config/default-tmf-config';
import { tmfConfigValidator } from './config/tmf-config-validator';
import { TmfConfigLoaderModule } from './config-loader/tmf-config-loader.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  TmaClientTokenInterceptor,
  TmaUserTokenInterceptor,
} from '../auth/http-interceptors';
import { TmfSubscriptionModule } from './adapters/subscription';
import { TmaTmfShoppingCartModule } from './adapters/cart';

@NgModule({
  imports: [
    TmaTmfChecklistActionModule,
    TmfSubscriptionModule,
    TmaTmfShoppingCartModule,
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
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaUserTokenInterceptor,
          multi: true,
        },
      ],
    };
  }
}
