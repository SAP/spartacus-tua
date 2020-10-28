import { CART_DATA, StateLoaderActions } from '@spartacus/core';

export enum TmaTmfCartActionTypes {
  UPDATE_CART = '[Cart] Update TMF Cart'
}

export class UpdateCart extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaTmfCartActionTypes.UPDATE_CART;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}
