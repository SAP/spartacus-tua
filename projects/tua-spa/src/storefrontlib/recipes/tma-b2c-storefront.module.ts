import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaStorefrontModule } from './tma-storefront.module';
import {
  provideConfig,
  provideDefaultConfig,
  provideDefaultConfigFactory
} from '@spartacus/core';
import { TmaStorefrontConfig } from '../tma-storefront-config';
import { TmaCmsLibModule } from '../cms-components';
import { tmaB2cLayoutConfig } from './config';
import {
  CmsLibModule,
  b2cLayoutConfig,
  mediaConfig,
  defaultCmsContentConfig,
  StorefrontModule,
  B2cStorefrontModule
} from '@spartacus/storefront';

@NgModule({
  imports: [
    TmaStorefrontModule,
    // the cms lib module contains all components that added in the bundle
    CmsLibModule,
    TmaCmsLibModule
  ],
  providers: [
    provideDefaultConfig({
      pwa: {
        enabled: true,
        addToHomeScreen: true
      }
    }),
    provideDefaultConfig(b2cLayoutConfig),
    provideDefaultConfig(mediaConfig),
    provideDefaultConfig(tmaB2cLayoutConfig),
    provideDefaultConfigFactory(defaultCmsContentConfig)
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
