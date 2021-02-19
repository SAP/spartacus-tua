import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, ConfigModule, I18nModule } from '@spartacus/core';
import { OutletModule, ProductSummaryModule } from '@spartacus/storefront';
import { TmaProductSummaryComponent } from './tma-product-summary.component';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductSummaryComponent: {
          component: TmaProductSummaryComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [TmaProductSummaryComponent],
  entryComponents: [TmaProductSummaryComponent],
  exports: [TmaProductSummaryComponent],
})
export class TmaProductSummaryModule extends ProductSummaryModule {
}
