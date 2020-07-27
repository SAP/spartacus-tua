import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CheckoutComponentModule,
  CheckoutOrchestratorModule,
  CheckoutProgressMobileBottomModule,
  CheckoutProgressMobileTopModule,
  CheckoutProgressModule,
  DeliveryModeModule,
  PaymentMethodModule,
  PlaceOrderModule,
  PromotionsModule,
  ShippingAddressModule
} from '@spartacus/storefront';
import { TmaCheckoutOrderSummaryModule } from './checkout-order-summary/tma-checkout-order-summary.module';
import { TmaReviewSubmitModule } from './review-submit/tma-review-submit.module';

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
    PlaceOrderModule,
    PromotionsModule,
    TmaReviewSubmitModule,
    ShippingAddressModule
  ]
})
export class TmaCheckoutComponentModule extends CheckoutComponentModule { }
