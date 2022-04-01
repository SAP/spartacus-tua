import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { OutletModule, ProductSummaryModule, SpinnerModule } from '@spartacus/storefront';
import { TmaProductSummaryComponent } from './tma-product-summary.component';
import { TmaPriceDisplayModule } from '../price/price-display/tma-price-display.module';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    SpinnerModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductSummaryComponent: {
          component: TmaProductSummaryComponent
        }
      }
    }),
    TmaPriceDisplayModule,
  ],
  declarations: [TmaProductSummaryComponent],
  entryComponents: [TmaProductSummaryComponent],
  exports: [TmaProductSummaryComponent]
})
export class TmaProductSummaryModule extends ProductSummaryModule {
}
