import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  provideConfig,
  RoutingModule as CoreRoutingModule,
  RoutingModule
} from '@spartacus/core';
import { CmsRouteModule } from '@spartacus/storefront';
import { defaultTmaSelfcareRoutingConfig } from '../../../core/tmf/adapters/selfcare/tmf-selfcare-routing-config';
import { defaultTmaRoutingConfig } from './tma-default-routing-config';

@NgModule({
  imports: [CoreRoutingModule.forRoot(), CmsRouteModule]
})
export class TmaRoutingModule extends RoutingModule {
  static forRoot(): ModuleWithProviders<TmaRoutingModule> {
    return {
      ngModule: TmaRoutingModule,
      providers: [
        provideConfig(defaultTmaRoutingConfig),
        provideConfig(defaultTmaSelfcareRoutingConfig)
      ]
    };
  }
}
