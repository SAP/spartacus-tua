import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { OutletModule, ProductSummaryModule } from '@spartacus/storefront';
import { TmaProductSummaryComponent } from './tma-product-summary.component';
import { TmaPriceModule } from '../price';

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
    TmaPriceModule
  ],
  declarations: [TmaProductSummaryComponent],
  entryComponents: [TmaProductSummaryComponent],
  exports: [TmaProductSummaryComponent]
})
export class TmaProductSummaryModule extends ProductSummaryModule { }
