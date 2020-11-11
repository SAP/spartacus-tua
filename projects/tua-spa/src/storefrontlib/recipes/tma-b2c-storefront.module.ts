import {
  b2cLayoutConfig,
  B2cStorefrontModule,
  CmsLibModule,
  defaultCmsContentConfig,
  StorefrontModule
} from '@spartacus/storefront';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaStorefrontModule } from './tma-storefront.module';
import { ConfigModule, provideConfig } from '@spartacus/core';
import { TmaStorefrontConfig } from '../tma-storefront-config';
import { TmaCmsLibModule } from '../cms-components';
import { tmaB2cLayoutConfig } from './config';

@NgModule({
  imports: [
    StorefrontModule.withConfig({
      pwa: {
        enabled: true,
        addToHomeScreen: true
      }
    }),

    ConfigModule.withConfig(b2cLayoutConfig),
    ConfigModule.withConfig(tmaB2cLayoutConfig),
    ConfigModule.withConfigFactory(defaultCmsContentConfig),

    // the cms lib module contains all components that added in the bundle
    CmsLibModule,
    TmaCmsLibModule
  ],
  exports: [StorefrontModule, TmaStorefrontModule]
})
export class TmaB2cStorefrontModule extends B2cStorefrontModule {
  static withConfig(
    config?: TmaStorefrontConfig
  ): ModuleWithProviders<TmaB2cStorefrontModule> {
    return {
      ngModule: TmaB2cStorefrontModule,
      providers: [provideConfig(config)]
    };
  }
}
