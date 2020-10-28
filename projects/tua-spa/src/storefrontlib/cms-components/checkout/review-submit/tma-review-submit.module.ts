import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ConfigModule,
  FeaturesConfigModule,
  I18nModule,
  UrlModule
} from '@spartacus/core';
import { TmaReviewSubmitComponent } from './tma-review-submit.component';
import {
  CardModule,
  CartNotEmptyGuard,
  CheckoutAuthGuard,
  DeliveryModeSetGuard,
  PaymentDetailsSetGuard,
  PromotionsModule,
  ShippingAddressSetGuard
} from '@spartacus/storefront';
import { TmaCartSharedModule } from '../../cart/cart-shared';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    TmaCartSharedModule,
    I18nModule,
    UrlModule,
    RouterModule,
    PromotionsModule,
    FeaturesConfigModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CheckoutReviewOrder: {
          component: TmaReviewSubmitComponent,
          guards: [
            CheckoutAuthGuard,
            CartNotEmptyGuard,
            ShippingAddressSetGuard,
            DeliveryModeSetGuard,
            PaymentDetailsSetGuard
          ]
        }
      }
    })
  ],
  declarations: [TmaReviewSubmitComponent],
  entryComponents: [TmaReviewSubmitComponent],
  exports: [TmaReviewSubmitComponent]
})
export class TmaReviewSubmitModule { }
