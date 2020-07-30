/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Component } from '@angular/core';
import { OrderDetailItemsComponent, OrderDetailsService, PromotionService } from '@spartacus/storefront';

@Component({
  selector: 'cx-order-details-items',
  templateUrl: './tma-order-detail-items.component.html',
})
export class TmaOrderDetailItemsComponent extends OrderDetailItemsComponent {

  constructor(
    orderDetailsService: OrderDetailsService,
    promotionService?: PromotionService
  ) {
    super(orderDetailsService, promotionService);
  }
}
