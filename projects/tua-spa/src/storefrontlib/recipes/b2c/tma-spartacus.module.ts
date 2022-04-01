import { NgModule } from '@angular/core';
import { BaseStorefrontModule } from '@spartacus/storefront';
import { TmaSpartacusB2cConfigurationModule } from './tma-spartacus-b2c-configuration.module';
import { TmaSpartacusB2cFeaturesModule } from './tma-spartacus-b2c-features.module';

@NgModule({
  imports: [
    BaseStorefrontModule,
    TmaSpartacusB2cFeaturesModule,
    TmaSpartacusB2cConfigurationModule
  ],
  exports: [BaseStorefrontModule],
})
export class TmaSpartacusModule {}
