import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  AsmModule,
  MainModule,
  ProductDetailsPageModule,
  ProductListingPageModule,
  StorefrontFoundationModule,
  StorefrontModule
} from '@spartacus/storefront';
import { ExternalRoutesModule, OccModule, PersonalizationModule, provideConfig, SiteContextModule, SmartEditModule } from '@spartacus/core';
import { TmfModule } from '../../core/tmf/tmf.module';
import { TmaStorefrontConfig } from '../tma-storefront-config';

@NgModule({
  imports: [
    RouterModule.forRoot([], {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),

    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictStateSerializability: true,
          strictActionImmutability: true,
          strictActionSerializability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),

    // ASM module must be imported before the `AuthModule (which is imported in `StorefrontFoundationModule`)
    // since we might have conflicting interceptor logic. See #5461.
    AsmModule,

    StorefrontFoundationModule,
    MainModule,
    SiteContextModule.forRoot(), // should be imported after RouterModule.forRoot, because it overwrites UrlSerializer

    SmartEditModule.forRoot(), // should be custom
    PersonalizationModule.forRoot(), // should be custom

    // opt-in explicitly
    OccModule.forRoot(),
    TmfModule.forRoot(),
    ProductDetailsPageModule,
    ProductListingPageModule,
    ExternalRoutesModule.forRoot(),
  ],
  exports: [MainModule, StorefrontFoundationModule],
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
