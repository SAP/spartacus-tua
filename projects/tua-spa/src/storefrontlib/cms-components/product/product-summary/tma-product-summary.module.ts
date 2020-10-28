import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { OutletModule, ProductSummaryModule } from '@spartacus/storefront';
import { TmaProductSummaryComponent } from './tma-product-summary.component';
import { TmaPriceModule } from '../price';
import { TmaPriceDisplayModule } from '../price/price-display/tma-price-display.module';
import { TmaDiscountDisplayModule } from '../../../shared/components/discount-display';
import { TmaAlterationDetailsModule } from '../price/alterations-details/tma-alteration-details.module';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductSummaryComponent: {
          component: TmaProductSummaryComponent
        }
      }
    }),
    TmaPriceModule,
    TmaPriceDisplayModule,
    TmaDiscountDisplayModule,
    TmaAlterationDetailsModule
  ],
  declarations: [TmaProductSummaryComponent],
  entryComponents: [TmaProductSummaryComponent],
  exports: [TmaProductSummaryComponent]
})
export class TmaProductSummaryModule extends ProductSummaryModule {
}
