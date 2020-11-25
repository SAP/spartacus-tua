import { Appointment } from './appointment.model';
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { TmaProcessType } from './tma-product.model';
import { TmfProduct } from './tmf-product.model';

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
}

export interface TmaTmfProductOffering {
  id?: string;
}

export enum TmaTmfActionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
}
