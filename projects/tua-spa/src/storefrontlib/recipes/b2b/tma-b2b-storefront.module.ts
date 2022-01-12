import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CmsLibModule, defaultCmsContentProviders, layoutConfig, mediaConfig } from '@spartacus/storefront';
import { CostCenterModule, provideConfig, provideDefaultConfig } from '@spartacus/core';
import { defaultB2bCheckoutConfig, defaultB2bOccConfig } from '@spartacus/setup';
import { TmaCmsLibModule } from '../../cms-components';
import { TmaStorefrontModule } from '../tma-storefront.module';
import { AdministrationRootModule } from '@spartacus/organization/administration/root';
import { OrderApprovalRootModule } from '@spartacus/organization/order-approval/root';
import { defaultTmaB2bLayoutConfig } from './config/default-tma-b2b-layout.config';
import { defaultTmaB2bOccConfig } from './config/default-tma-b2b-occ.config';
import { TmaStorefrontConfig } from '../../tma-storefront-config';

@NgModule({
  imports: [
    HttpClientModule,
    TmaStorefrontModule,

    // the cms lib module contains all components that added in the bundle
    CmsLibModule,
    TmaCmsLibModule,
    CostCenterModule.forRoot(),
    AdministrationRootModule,
    OrderApprovalRootModule
  ],
  providers: [
    provideDefaultConfig(layoutConfig),
    provideDefaultConfig(defaultTmaB2bLayoutConfig),
    provideDefaultConfig(mediaConfig),
    provideDefaultConfig(defaultB2bOccConfig),
    provideDefaultConfig(defaultTmaB2bOccConfig),
    provideDefaultConfig(defaultB2bCheckoutConfig),
    ...defaultCmsContentProviders
  ],
  exports: [TmaStorefrontModule]
})
export class TmaB2bStorefrontModule {
  static withConfig(
    config?: TmaStorefrontConfig
  ): ModuleWithProviders<TmaB2bStorefrontModule> {
    return {
      ngModule: TmaB2bStorefrontModule,
      providers: [provideConfig(config)]
    };
  }
}
