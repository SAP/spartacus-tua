import { MULTI_CART_DATA, StateUtils } from '@spartacus/core';

export enum TmaTmfCartActionTypes {
  UPDATE_CART = '[Cart] Update TMF Cart'
}

export class UpdateCart extends StateUtils.LoaderLoadAction {
  readonly type = TmaTmfCartActionTypes.UPDATE_CART;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}
