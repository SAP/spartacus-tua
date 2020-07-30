/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { NgModule } from '@angular/core';
import {
  OrderCancellationModule,
  OrderHistoryModule,
  OrderModule,
  OrderReturnModule,
  ReturnRequestDetailModule,
  ReturnRequestListModule
} from '@spartacus/storefront';
import { TmaOrderDetailsModule } from './order-details';

@NgModule({
  imports: [
    OrderHistoryModule,
    TmaOrderDetailsModule,
    OrderCancellationModule,
    OrderReturnModule,
    ReturnRequestListModule,
    ReturnRequestDetailModule
  ]
})
export class TmaOrderModule extends OrderModule { }
