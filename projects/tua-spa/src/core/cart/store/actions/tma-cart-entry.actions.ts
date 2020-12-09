import { MULTI_CART_DATA , StateUtils } from '@spartacus/core';

export enum TmaCartEntryActionTypes {
  ADD_CART_ENTRY = '[Cart-entry] Add Cart Entry',
  ADD_CART_ENTRY_SUCCESS = '[Cart-entry] Add Cart Entry Success',
  ADD_CART_ENTRY_FAIL = '[Cart-entry] Add Cart Entry Fail',
  UPDATE_CART_ENTRY = '[Cart-entry] Update Cart Entry',
  UPDATE_CART_ENTRY_SUCCESS = '[Cart-entry] Update Cart Entry Success',
  UPDATE_CART_ENTRY_FAIL = '[Cart-entry] Update Cart Entry Fail',
  LOAD_CART = '[Cart] Load Cart'
}

export class AddCartEntry extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY;

  constructor(public payload: any) {
    super(MULTI_CART_DATA );
  }
}

export class AddCartEntrySuccess extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY_SUCCESS;

  constructor(public payload: any) {
    super(MULTI_CART_DATA );
  }
}

export class AddCartEntryFail extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY_FAIL;

  constructor(public payload: any) {
    super(MULTI_CART_DATA );
  }
}

export class UpdateCartEntry extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY;

  constructor(public payload: any) {
    super(MULTI_CART_DATA );
  }
}

export class LoadCart extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.LOAD_CART;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}

export class UpdateCartEntrySuccess extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY_SUCCESS;

  constructor(public payload: any) {
    super(MULTI_CART_DATA );
  }
}

export class UpdateCartEntryFail extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY_FAIL;

  constructor(public payload: any) {
    super(MULTI_CART_DATA );
  }
}

export type TmaCartActionType =
  | AddCartEntry
  | AddCartEntrySuccess
  | AddCartEntryFail
  | UpdateCartEntry
  | UpdateCartEntrySuccess
  | UpdateCartEntryFail;
