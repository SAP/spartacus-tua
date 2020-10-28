import { NgModule } from '@angular/core';
import { TmaProductListModule, TmaProductSummaryModule } from './product';
import { TmaCartComponentModule } from './cart';
import { TmaCheckoutComponentModule } from './checkout';
import { TmaOrderConfirmationModule } from './order-confirmation';
import { TmaOrderModule } from './myaccount/order/tma-order.module';
import { TmaProductTabsModule } from './product/product-tabs';
import { SubscriptionComponentModule } from './myaccount';
import { TmaGuidedSellingModule } from './guided-selling';
import { JourneyChecklistComponentModule } from './journey-checklist';
import { LogicalResourceModule } from './cart/cart-shared/logical-resource';

@NgModule({
  imports: [
    TmaProductListModule,
    TmaProductSummaryModule,
    TmaProductTabsModule,
    TmaCartComponentModule,
    TmaCheckoutComponentModule,
    TmaOrderConfirmationModule,
    TmaOrderModule,
    SubscriptionComponentModule,
    TmaGuidedSellingModule,
    LogicalResourceModule,
    JourneyChecklistComponentModule,
  ],
})
export class TmaCmsLibModule {}
