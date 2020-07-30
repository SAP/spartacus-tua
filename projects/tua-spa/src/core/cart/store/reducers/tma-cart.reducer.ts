/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { CartState } from '@spartacus/core';
import { TmaCartActionType, TmaCartEntryActionTypes } from '../actions/tma-cart-entry.actions';

export const initialState: CartState = {
  content: {},
  entries: {},
  refresh: false,
  cartMergeComplete: false,
};

export function tmaCartReducer(
  state = initialState,
  action: TmaCartActionType
): CartState {
  switch (action.type) {
    case TmaCartEntryActionTypes.ADD_CART_ENTRY:
    case TmaCartEntryActionTypes.ADD_CART_ENTRY_SUCCESS:
    case TmaCartEntryActionTypes.UPDATE_CART_ENTRY:
    case TmaCartEntryActionTypes.UPDATE_CART_ENTRY_SUCCESS: {
      return {
        ...state,
        refresh: true
      };
    }
    case TmaCartEntryActionTypes.ADD_CART_ENTRY_FAIL:
    case TmaCartEntryActionTypes.UPDATE_CART_ENTRY_FAIL: {
      return {
        ...state
      };
    }
  }
}
