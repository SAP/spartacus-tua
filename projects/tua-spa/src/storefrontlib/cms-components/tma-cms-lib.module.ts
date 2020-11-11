import { NgModule } from '@angular/core';
import { TmaAddressFormModule } from './address-form';
import { TmaCartComponentModule } from './cart';
import { LogicalResourceModule } from './cart/cart-shared/logical-resource';
import { TmaCheckoutComponentModule } from './checkout';
import { TmaConsumptionModule } from './consumption';
import { TmaGuidedSellingModule } from './guided-selling';
import { JourneyChecklistComponentModule } from './journey-checklist';
import { SubscriptionComponentModule } from './myaccount';
import { TmaOrderModule } from './myaccount/order/tma-order.module';
import { TmaOrderConfirmationModule } from './order-confirmation';
import { TmaPremiseDetailsModule } from './premise-details';
import { TmaProductListModule, TmaProductSummaryModule } from './product';
import { TmaProductTabsModule } from './product/product-tabs';


@NgModule({
  imports: [
    TmaProductListModule,
    TmaProductSummaryModule,
    TmaProductTabsModule,
    TmaCartComponentModule,
    TmaCheckoutComponentModule,
    TmaConsumptionModule,
    TmaOrderConfirmationModule,
    TmaOrderModule,
    TmaGuidedSellingModule,
    TmaPremiseDetailsModule,
    SubscriptionComponentModule,
    TmaGuidedSellingModule,
    JourneyChecklistComponentModule,
    TmaAddressFormModule,
    LogicalResourceModule
  ],
})
export class TmaCmsLibModule {}
