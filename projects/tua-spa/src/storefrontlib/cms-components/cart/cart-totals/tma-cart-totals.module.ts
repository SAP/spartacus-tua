import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { TmaCartTotalsComponent } from './tma-cart-totals.component';
import { CartCouponModule, CartTotalsModule } from '@spartacus/storefront';
import { TmaCartSharedModule } from '../cart-shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CartTotalsComponent: {
          component: TmaCartTotalsComponent
        }
      }
    }),
    TmaCartSharedModule,
    I18nModule,
    CartCouponModule
  ],
  declarations: [TmaCartTotalsComponent],
  exports: [TmaCartTotalsComponent],
  entryComponents: [TmaCartTotalsComponent]
})
export class TmaCartTotalsModule extends CartTotalsModule { }
