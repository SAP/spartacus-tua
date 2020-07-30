/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
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
