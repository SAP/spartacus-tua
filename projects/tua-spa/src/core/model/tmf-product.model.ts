import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { TmaTmfProductOffering } from './tma-tmf-shopping-cart.model';
import { RelatedPlaceRef } from './appointment.model';
import { ProductRef } from './subscription-base.model';

export interface TmfProduct {
  id?: string;
  name?: string;
  bundleProductCode?: string;
  startDate?: Date;
  status?: TmfProductStatus;
  isBundle?: boolean;
  isCustomerVisible?: boolean;
  terminationDate?: Date;
  relatedParty?: TmaTmfRelatedParty[];
  productOrderItem?: TmfProductOrder[];
  productRelationship?: TmfProductRelationship[];
  place?: RelatedPlaceRef[];
  characteristic?: TmfProductCharacteristic[];
  productOffering?: TmaTmfProductOffering;
}

export enum TmfProductStatus {
  CREATED = 'CREATED',
  PENDINGACTIVE = 'PENDINGACTIVE',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
  PENDINGTERMINATE = 'PENDINGTERMINATE',
  TERMINATED = 'TERMINATED',
  SUSPENDED = 'SUSPENDED',
  ABORTED = 'ABORTED',
}

export enum TmfProductRelatedPartyRole {
  OWNER = 'OWNER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  BENEFICIARY = 'BENEFICIARY',
}

export interface TmfProductRelationship {
  id?: string;
  name?: string;
  href?: string;
  type?: string;
  product?: ProductRef;
  publicIdentifier?: string;
  user?: TmaTmfRelatedParty;
}
export interface TmaTimePeriod {
  startDateTime: Date;
  endDateTime: Date;
}
export interface TmfProductOrder {
  id?: string;
  productOrderId?: string;
  orderItemId?: string;
}
export interface TmfProductCharacteristic {
  id?: string;
  name?: string;
  value?: string;
}
export enum TmfProductOfferingType {
  OPERATIONAL_PRODUCT_OFFERING = 'OperationalProductOffering'
}
