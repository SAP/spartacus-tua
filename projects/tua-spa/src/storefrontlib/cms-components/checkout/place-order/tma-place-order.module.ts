import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartNotEmptyGuard, CheckoutAuthGuard, PlaceOrderModule } from "@spartacus/checkout/components";
import {
  CmsConfig,
  ConfigModule,
  I18nModule,
  UrlModule
} from '@spartacus/core';
import {
  SpinnerComponent
} from '@spartacus/storefront';
import { TmaPlaceOrderComponent } from './tma-place-order.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutPlaceOrder: {
          component: TmaPlaceOrderComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [TmaPlaceOrderComponent],
  entryComponents: [TmaPlaceOrderComponent, SpinnerComponent],
  exports: [TmaPlaceOrderComponent],
})
export class TmaPlaceOrderModule extends PlaceOrderModule { }
