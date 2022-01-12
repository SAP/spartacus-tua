import { NgModule } from '@angular/core';
import { TmaAddressFormModule } from './address-form';
import { TmaCartComponentModule } from './cart';
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
import { ServiceabilityBannerModule } from './serviceability';
import { ServiceabilityButtonModule } from './serviceability-button';
import { TmaOrderApprovalModule } from './order-approval';
import { TmaProductSpecificationModule } from './product/tma-product-specification/tma-product-specification.module';

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
    JourneyChecklistComponentModule,
    TmaAddressFormModule,
    TmaPremiseDetailsModule,
    TmaConsumptionModule,
    ServiceabilityBannerModule,
    ServiceabilityButtonModule,
    TmaOrderApprovalModule,
    TmaProductSpecificationModule
  ],
  declarations: []
})
export class TmaCmsLibModule {}
