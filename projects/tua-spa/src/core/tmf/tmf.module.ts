import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig, provideConfigValidator } from '@spartacus/core';
import {
  TmaClientTokenInterceptor,
  TmaUserTokenInterceptor
} from '../auth/http-interceptors';
import { TmfProductOfferingModule } from './adapters';
import { TmaTmfShoppingCartModule } from './adapters/cart';
import { TmaTmfChecklistActionModule } from './adapters/checklistaction';
import { TmfGeographicAddressModule } from './adapters/geographic-address';
import { TmfRecommendationModule } from './adapters/recommendation';
import { TmfSelfcareModule } from './adapters/selfcare';
import { TmfSubscriptionModule } from './adapters/subscription';
import { TmfConfigLoaderModule } from './config-loader/tmf-config-loader.module';
import { defaultTmfConfig } from './config/default-tmf-config';
import { TmfConfig } from './config/tmf-config';
import { tmfConfigValidator } from './config/tmf-config-validator';

@NgModule({
  imports: [
    TmaTmfChecklistActionModule,
    TmfSubscriptionModule,
    TmaTmfShoppingCartModule,
    TmfConfigLoaderModule.forRoot(),
    TmfRecommendationModule,
    TmfGeographicAddressModule,
    TmfProductOfferingModule,
    TmfSelfcareModule
  ]
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
        }
      ]
    };
  }
}
