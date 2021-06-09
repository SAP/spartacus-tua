import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  ProductDetailsPageModule,
  ProductListingPageModule,
  StorefrontFoundationModule,
  StorefrontModule
} from '@spartacus/storefront';
import { AsmModule, ExternalRoutesModule, OccModule, PersonalizationModule, provideConfig, SiteContextModule, SmartEditModule } from '@spartacus/core';
import { TmaStorefrontConfig } from '../tma-storefront-config';
import { TmaStorefrontFoundationModule } from './tma-storefront-foundation.module';
import { TmaOccModule } from '../../core/occ';
import { TmfModule } from '../../core/tmf';
import { TmfAppointmentModule } from '../../core/tmf-appointment';
import { TmfResourcePoolManagementModule } from '../../core/tmf-resource-pool-management/tmf-resource-pool-management.module';
import { TmfQueryServiceQualificationModule } from '../../core/tmf-service-qualification-management';
import { PremiseLookupModule } from '../../core';
import { TmaMainModule } from '../layout';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    RouterModule.forRoot([], {
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'corrected',
      initialNavigation: 'enabled',
    }),

    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),

    // ASM module must be imported before the `AuthModule (which is imported in `StorefrontFoundationModule`)
    // since we might have conflicting interceptor logic. See #5461.
    AsmModule,

    StorefrontFoundationModule,
    TmaMainModule,
    SiteContextModule.forRoot(), // should be imported after RouterModule.forRoot, because it overwrites UrlSerializer

    SmartEditModule.forRoot(), // should be custom
    PersonalizationModule.forRoot(), // should be custom

    // opt-in explicitly
    OccModule.forRoot(),
    ProductDetailsPageModule,
    ProductListingPageModule,
    ExternalRoutesModule.forRoot(),

    // tma modules
    TmaOccModule.forRoot(),
    TmfModule.forRoot(),
    PremiseLookupModule.forRoot(),
    TmfResourcePoolManagementModule.forRoot(),
    TmfAppointmentModule.forRoot(),
    TmfQueryServiceQualificationModule.forRoot()
  ],
  exports: [
    TmaMainModule,
    StorefrontFoundationModule,
    TmaStorefrontFoundationModule
  ]
})
export class TmaStorefrontModule extends StorefrontModule {
  static withConfig(
    config?: TmaStorefrontConfig
  ): ModuleWithProviders<TmaStorefrontModule> {
    return {
      ngModule: TmaStorefrontModule,
      providers: [provideConfig(config)]
    };
  }
}
