/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { TmaProcessType } from './tma-product.model';

export interface TmaTmfShoppingCart {
  id?: string;
  guid?: string;
  href?: string;
  baseSiteId?: string;
  cartItem?: TmaTmfCartItem[];
  relatedParty?: TmaTmfRelatedParty[];
}

export interface TmaTmfCartItem {
  id?: string;
  action?: TmaTmfActionType;
  quantity?: number;
  cartItem?: TmaTmfCartItem[];
  productOffering?: TmaTmfProductOffering;
  processType?: TmaProcessType;
}

export interface TmaTmfProductOffering {
  id?: string;
}

export enum TmaTmfActionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE'
}
