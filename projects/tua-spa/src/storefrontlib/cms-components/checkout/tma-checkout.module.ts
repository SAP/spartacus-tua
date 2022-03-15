import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CheckoutComponentsModule,
  CheckoutOrchestratorModule,
  CheckoutProgressMobileBottomModule,
  CheckoutProgressMobileTopModule,
  CheckoutProgressModule,
  DeliveryModeModule,
  PaymentMethodModule,
  ShippingAddressModule 
} from "@spartacus/checkout/components";
import { PromotionsModule } from '@spartacus/storefront';
import { TmaCheckoutOrderSummaryModule } from './checkout-order-summary/tma-checkout-order-summary.module';
import { TmaReviewSubmitModule } from './review-submit/tma-review-submit.module';
import { TmaPlaceOrderModule } from './place-order/tma-place-order.module';

@NgModule({
  imports: [
    CommonModule,
    CheckoutOrchestratorModule,
    TmaCheckoutOrderSummaryModule,
    CheckoutProgressModule,
    CheckoutProgressMobileTopModule,
    CheckoutProgressMobileBottomModule,
    DeliveryModeModule,
    PaymentMethodModule,
    PromotionsModule,
    TmaReviewSubmitModule,
    ShippingAddressModule,
    TmaPlaceOrderModule,
  ],
})
export class TmaCheckoutComponentModule extends CheckoutComponentsModule { }
