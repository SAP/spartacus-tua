import { CART_DATA, StateLoaderActions } from '@spartacus/core';

export enum TmaCartEntryActionTypes {
  ADD_CART_ENTRY = '[Cart-entry] Add Cart Entry',
  ADD_CART_ENTRY_SUCCESS = '[Cart-entry] Add Cart Entry Success',
  ADD_CART_ENTRY_FAIL = '[Cart-entry] Add Cart Entry Fail',
  UPDATE_CART_ENTRY = '[Cart-entry] Update Cart Entry',
  UPDATE_CART_ENTRY_SUCCESS = '[Cart-entry] Update Cart Entry Success',
  UPDATE_CART_ENTRY_FAIL = '[Cart-entry] Update Cart Entry Fail'
}

export class AddCartEntry extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY;
  
  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class AddCartEntrySuccess extends StateLoaderActions.LoaderSuccessAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY_SUCCESS;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class AddCartEntryFail extends StateLoaderActions.LoaderFailAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY_FAIL;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class UpdateCartEntry extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class UpdateCartEntrySuccess extends StateLoaderActions.LoaderSuccessAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY_SUCCESS;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class UpdateCartEntryFail extends StateLoaderActions.LoaderFailAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY_FAIL;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export type TmaCartActionType =
  | AddCartEntry
  | AddCartEntrySuccess
  | AddCartEntryFail
  | UpdateCartEntry
  | UpdateCartEntrySuccess
  | UpdateCartEntryFail;
