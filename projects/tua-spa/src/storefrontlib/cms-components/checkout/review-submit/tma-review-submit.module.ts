import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartNotEmptyGuard, CheckoutAuthGuard } from "@spartacus/checkout/components";
import {
  CmsConfig,
  ConfigModule,
  I18nModule,
  UrlModule
} from '@spartacus/core';
import {
  CardModule,
  IconModule,
  PromotionsModule
} from '@spartacus/storefront';
import { TmaCartSharedModule } from '../../cart/cart-shared';
import { TmaReviewSubmitComponent } from './tma-review-submit.component';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    TmaCartSharedModule,
    I18nModule,
    UrlModule,
    RouterModule,
    PromotionsModule,
    IconModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutReviewOrder: {
          component: TmaReviewSubmitComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [TmaReviewSubmitComponent],
  entryComponents: [TmaReviewSubmitComponent],
  exports: [TmaReviewSubmitComponent],
})
export class TmaReviewSubmitModule { }
