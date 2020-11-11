import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { OutletModule, ProductSummaryModule, SpinnerModule } from '@spartacus/storefront';
import { TmaPriceModule } from '../price';
import { TmaProductSummaryComponent } from './tma-product-summary.component';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    TmaPriceModule,
    SpinnerModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductSummaryComponent: {
          component: TmaProductSummaryComponent
        }
      }
    })
  ],
  declarations: [TmaProductSummaryComponent],
  entryComponents: [TmaProductSummaryComponent],
  exports: [TmaProductSummaryComponent]
})
export class TmaProductSummaryModule extends ProductSummaryModule {
}
