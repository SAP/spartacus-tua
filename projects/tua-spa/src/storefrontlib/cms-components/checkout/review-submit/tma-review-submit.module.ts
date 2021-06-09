import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { TmaReviewSubmitComponent } from './tma-review-submit.component';
import {
  CardModule,
  CartNotEmptyGuard,
  CartSharedModule,
  CheckoutAuthGuard,
  IconModule,
  PromotionsModule,
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
    IconModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
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
export class TmaReviewSubmitModule {}
