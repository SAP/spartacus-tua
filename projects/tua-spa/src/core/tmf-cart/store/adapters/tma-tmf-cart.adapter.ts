/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmaTmfShoppingCart } from '../../../model';
import { Observable } from 'rxjs';

export abstract class TmaTmfCartAdapter {

  /**
   * Abstract method used to updating a cart.
   *
   * @param shoppingCart - The model containing the information about the cart used for updating the cart
   */
  abstract updateCart(shoppingCart: TmaTmfShoppingCart): Observable<TmaTmfShoppingCart>;
}
