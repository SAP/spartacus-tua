/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ActionReducerMap } from '@ngrx/store';
import { CART_DATA, CartsState, CartState, loaderReducer } from '@spartacus/core';
import { tmaCartReducer } from './tma-cart.reducer';

export function getReducers(): ActionReducerMap<CartsState> {
  return {
    active: loaderReducer<CartState>(CART_DATA, tmaCartReducer),
  };
}
