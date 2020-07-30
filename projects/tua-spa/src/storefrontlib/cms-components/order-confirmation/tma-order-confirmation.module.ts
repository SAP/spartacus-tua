/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { NgModule } from '@angular/core';
import {
  CardModule,
  OrderConfirmationGuard,
  OrderConfirmationModule,
  PromotionsModule,
  PwaModule
} from '@spartacus/storefront';
import { CommonModule } from '@angular/common';
import { ConfigModule, FeaturesConfigModule, I18nModule } from '@spartacus/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TmaCartSharedModule } from '../cart/cart-shared';
import { TmaOrderConfirmationItemsComponent, TmaOrderConfirmationTotalsComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    TmaCartSharedModule,
    CardModule,
    PwaModule,
    PromotionsModule,
    I18nModule,
    ReactiveFormsModule,
    FeaturesConfigModule,
    ConfigModule.withConfig({
      cmsComponents: {
        OrderConfirmationItemsComponent: {
          component: TmaOrderConfirmationItemsComponent,
          guards: [OrderConfirmationGuard]
        },
        OrderConfirmationTotalsComponent: {
          component: TmaOrderConfirmationTotalsComponent,
          guards: [OrderConfirmationGuard]
        }
      }
    })
  ],
  declarations: [TmaOrderConfirmationItemsComponent, TmaOrderConfirmationTotalsComponent],
  exports: [TmaOrderConfirmationItemsComponent, TmaOrderConfirmationTotalsComponent],
  entryComponents: [TmaOrderConfirmationItemsComponent, TmaOrderConfirmationTotalsComponent]
})
export class TmaOrderConfirmationModule extends OrderConfirmationModule { }
