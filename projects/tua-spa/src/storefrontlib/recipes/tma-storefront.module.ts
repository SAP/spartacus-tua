import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  MainModule,
  StorefrontFoundationModule,
  StorefrontModule,
} from '@spartacus/storefront';
import { provideConfig } from '@spartacus/core';
import { TmaStorefrontConfig } from '../tma-storefront-config';
import { TmaStorefrontFoundationModule } from './tma-storefront-foundation.module';
import { TmaOccModule } from '../../core/occ';
import { TmfModule } from '../../core/tmf';
import { TmfAppointmentModule } from '../../core/tmf-appointment';
import { PremiseLookupModule } from '../../core/premiselookup';
import { TmfResourcePoolManagementModule } from '../../core/tmf-resource-pool-management/tmf-resource-pool-management.module';


@NgModule({
  imports: [
    TmaOccModule.forRoot(),
    TmfModule.forRoot(),
    PremiseLookupModule.forRoot(),
    TmfResourcePoolManagementModule.forRoot(),
    TmfAppointmentModule.forRoot(),
  ],
  exports: [
    MainModule,
    StorefrontFoundationModule,
    TmaStorefrontFoundationModule,
  ],
})
export class TmaStorefrontModule extends StorefrontModule {
  static withConfig(
    config?: TmaStorefrontConfig
  ): ModuleWithProviders<TmaStorefrontModule> {
    return {
      ngModule: TmaStorefrontModule,
      providers: [provideConfig(config)],
    };
  }
}
