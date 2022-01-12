import { Appointment } from './appointment.model';
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { TmfProduct } from './tmf-product.model';
import { TmaSubscriptionTerm } from './tma-cart.entry.model';
import { TmaProcessType } from './tma-common.model';

export interface TmaShoppingCartRef {
  href?: string;
  id?: string;
}
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
  appointment?: Appointment;
  product?: TmfProduct;
  itemTerm?: TmaSubscriptionTerm[];
}

export interface TmaTmfProductOffering {
  id?: string;
  '@referredType'?: string;
}

export enum TmaTmfActionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  KEEP = 'KEEP',
  REMOVE = 'REMOVE'
}
