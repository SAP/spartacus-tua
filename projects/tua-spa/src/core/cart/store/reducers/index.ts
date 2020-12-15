import { ActionReducerMap } from '@ngrx/store';
import { CART_DATA, CartsState, CartState, loaderReducer } from '@spartacus/core';
import { tmaCartReducer } from './tma-cart.reducer';

export function getReducers(): ActionReducerMap<CartsState> {
  return {
    active: loaderReducer<CartState>(CART_DATA, tmaCartReducer),
  };
}
