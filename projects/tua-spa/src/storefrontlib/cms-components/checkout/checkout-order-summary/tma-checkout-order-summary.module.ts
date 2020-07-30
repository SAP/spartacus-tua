/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigModule } from '@spartacus/core';
import { TmaCartSharedModule } from '../../cart/cart-shared';
import { CheckoutOrderSummaryModule } from '@spartacus/storefront';
import { TmaCheckoutOrderSummaryComponent } from './tma-checkout-order-summary.component';

@NgModule({
  imports: [
    CommonModule,
    TmaCartSharedModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CheckoutOrderSummary: {
          component: TmaCheckoutOrderSummaryComponent
        }
      }
    })
  ],
  declarations: [TmaCheckoutOrderSummaryComponent],
  entryComponents: [TmaCheckoutOrderSummaryComponent],
  exports: [TmaCheckoutOrderSummaryComponent]
})
export class TmaCheckoutOrderSummaryModule extends CheckoutOrderSummaryModule { }
