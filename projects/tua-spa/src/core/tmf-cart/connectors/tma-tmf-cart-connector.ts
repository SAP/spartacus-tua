/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Injectable } from '@angular/core';
import { TmaTmfShoppingCart } from '../../model';
import { Observable } from 'rxjs';
import { TmaTmfCartAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root'
})
export class TmaTmfCartConnector {

  constructor(
    protected adapter: TmaTmfCartAdapter
  ) {
  }

  /**
   * Updates the shopping cart.
   *
   * @param shoppingCart - The shopping cart to be updated
   */
  public updateCart(shoppingCart: TmaTmfShoppingCart): Observable<TmaTmfShoppingCart> {
    return this.adapter.updateCart(shoppingCart);
  }
}
