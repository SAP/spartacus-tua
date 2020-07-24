import { NgModule } from '@angular/core';
import { TmaProductListModule, TmaProductSummaryModule } from './product';
import { TmaCartComponentModule } from './cart';
import { TmaCheckoutComponentModule } from './checkout';
import { TmaOrderConfirmationModule } from './order-confirmation';
import { TmaOrderModule } from './myaccount/order/tma-order.module';
import { TmaProductTabsModule } from './product/product-tabs';
import { TmaGuidedSellingModule } from './guided-selling';

@NgModule({
  imports: [
    TmaProductListModule,
    TmaProductSummaryModule,
    TmaProductTabsModule,
    TmaCartComponentModule,
    TmaCheckoutComponentModule,
    TmaOrderConfirmationModule,
    TmaOrderModule,
    TmaGuidedSellingModule
  ]
})
export class TmaCmsLibModule {
}
