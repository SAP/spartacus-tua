/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CartEntryConnector, CartModification } from '@spartacus/core';
import { TmaCartEntryAdapter } from '../store/adapters/tma-cart-entry.adapter';
import { TmaOrderEntry } from '../../model/tma-cart.entry.model';

@Injectable({
  providedIn: 'root',
})
export class TmaCartEntryConnector extends CartEntryConnector {
  constructor(protected adapter: TmaCartEntryAdapter) {
    super(adapter);
  }

  public addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry,
  ): Observable<CartModification> {
    return this.adapter.addCartEntry(userId, cartId, cartEntry);
  }

  public updateCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry,
  ): Observable<CartModification> {
    return this.adapter.updateCartEntry(userId, cartId, cartEntry);
  }
}
