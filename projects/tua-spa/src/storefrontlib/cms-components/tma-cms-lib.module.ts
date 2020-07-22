import { NgModule } from '@angular/core';
import { TmaProductListModule, TmaProductSummaryModule } from './product';
import { TmaCartComponentModule } from './cart/tma-cart.module';
import { TmaCheckoutComponentModule } from './checkout/tma-checkout.module';
import { TmaOrderConfirmationModule } from './order-confirmation';
import { TmaOrderModule } from './myaccount/order/tma-order.module';
import { TmaProductTabsModule } from './product/product-tabs/tma-product-tabs.module';

@NgModule({
  imports: [
    TmaProductListModule,
    TmaProductSummaryModule,
    TmaProductTabsModule,
    TmaCartComponentModule,
    TmaCheckoutComponentModule,
    TmaOrderConfirmationModule,
    TmaOrderModule,
  ]
})
export class TmaCmsLibModule {
}
