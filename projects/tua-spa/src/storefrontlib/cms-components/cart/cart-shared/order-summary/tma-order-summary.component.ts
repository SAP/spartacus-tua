/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Component, Input, OnInit } from '@angular/core';
import { OrderSummaryComponent } from '@spartacus/storefront';
import { CurrencyService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaCart } from '../../../../../core/model';
import { TmaCartPriceService } from '../../../../../core/cart/facade';

@Component({
  selector: 'cx-order-summary',
  templateUrl: './tma-order-summary.component.html'
})
export class TmaOrderSummaryComponent extends OrderSummaryComponent implements OnInit {

  @Input()
  cart: TmaCart;

  currency$: Observable<string>;

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected currencyService: CurrencyService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currency$ = this.currencyService.getActive();
  }
}
