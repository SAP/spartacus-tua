import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartItemUsageChargeComponent } from './cart-item-usage-charge/cart-item-usage-charge.component';
import { CartItemRecurringChargeComponent } from './cart-item-recurring-charge/cart-item-recurring-charge.component';
import { CartItemOneTimeChargeComponent } from './cart-item-one-time-charge/cart-item-one-time-charge.component';
import { I18nModule } from '@spartacus/core';
import { TmaCartItemPriceDisplayModule } from '../cart-item-price-display/tma-cart-item-price-display.module';
import { CartItemUsageChangeDisplayComponent } from './cart-item-usage-charge/cart-item-usage-charge-display/cart-item-usage-change-display.component';
import { TmaDiscountDisplayModule } from '../../../../shared/components/discount-display';
import { CartItemAlterationsDetailsModule } from './cart-item-alterations-details/cart-item-alterations-details.module';

@NgModule({
  declarations: [CartItemUsageChargeComponent, CartItemRecurringChargeComponent, CartItemOneTimeChargeComponent,CartItemUsageChangeDisplayComponent],
  imports: [
    CommonModule,
    NgbModule,
    I18nModule,
    TmaCartItemPriceDisplayModule,
    TmaDiscountDisplayModule,
    CartItemAlterationsDetailsModule
  ],
  exports: [CartItemUsageChargeComponent, CartItemRecurringChargeComponent, CartItemOneTimeChargeComponent,CartItemUsageChangeDisplayComponent]
})
export class CartItemPriceModule { }
