import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaStorefrontModule } from './tma-storefront.module';
import {
  provideConfig,
  provideDefaultConfig,
} from '@spartacus/core';
import { TmaStorefrontConfig } from '../tma-storefront-config';
import { TmaCmsLibModule } from '../cms-components';
import { tmaB2cLayoutConfig } from './config';
import {
  CmsLibModule,
  mediaConfig,
  B2cStorefrontModule,
  layoutConfig,
  defaultCmsContentProviders
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
    provideDefaultConfig(layoutConfig),
    provideDefaultConfig(mediaConfig),
    provideDefaultConfig(tmaB2cLayoutConfig),
    ...defaultCmsContentProviders,
  ],
  exports: [TmaStorefrontModule]
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
