/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Component } from '@angular/core';
import { OrderDetailsService, OrderDetailTotalsComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaOrder } from '../../../../../../core/model';

@Component({
  selector: 'cx-order-details-totals',
  templateUrl: './tma-order-detail-totals.component.html',
})
export class TmaOrderDetailTotalsComponent extends OrderDetailTotalsComponent {

  order$: Observable<TmaOrder>;

  constructor(protected orderDetailsService: OrderDetailsService) {
    super(orderDetailsService);
  }
}
