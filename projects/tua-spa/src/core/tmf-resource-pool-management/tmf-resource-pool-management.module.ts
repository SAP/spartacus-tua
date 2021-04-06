import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfigValidator, provideConfig } from '@spartacus/core';
import { TmaClientTokenInterceptor, TmaUserTokenInterceptor } from '..';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  tmaConfigValidator,
  defaultResourceTmfConfig,
  TmfResourcePoolManagementConfig
} from './config';
import { TmfReservationModule } from './adapters/reservation';
import { TmfAvailabilityCheckModule } from './adapters/availability-check';

@NgModule({
  imports: [TmfAvailabilityCheckModule, TmfReservationModule]
})
export class TmfResourcePoolManagementModule {
  static forRoot(): ModuleWithProviders<TmfResourcePoolManagementModule> {
    return {
      ngModule: TmfResourcePoolManagementModule,
      providers: [
        { provide: TmfResourcePoolManagementConfig, useExisting: Config },
        provideConfig(defaultResourceTmfConfig),
        provideConfigValidator(tmaConfigValidator),
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
