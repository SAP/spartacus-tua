import { b2cLayoutConfig, B2cStorefrontModule, CmsLibModule, defaultCmsContentConfig } from '@spartacus/storefront';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaStorefrontModule } from './tma-storefront.module';
import { ConfigModule, provideConfig } from '@spartacus/core';
import { TmaStorefrontConfig } from '../tma-storefront-config';

@NgModule({
  imports: [
    TmaStorefrontModule.withConfig({
      pwa: {
        enabled: true,
        addToHomeScreen: true,
      },
    } as TmaStorefrontConfig),

    ConfigModule.withConfig(b2cLayoutConfig),
    ConfigModule.withConfigFactory(defaultCmsContentConfig),

    // the cms lib module contains all components that added in the bundle
    CmsLibModule,
  ],
  exports: [TmaStorefrontModule],
})
export class TmaB2cStorefrontModule extends B2cStorefrontModule {
  static withConfig(
    config?: TmaStorefrontConfig
  ): ModuleWithProviders<TmaB2cStorefrontModule> {
    return {
      ngModule: TmaB2cStorefrontModule,
      providers: [provideConfig(config)],
    };
  }
}
