/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
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
