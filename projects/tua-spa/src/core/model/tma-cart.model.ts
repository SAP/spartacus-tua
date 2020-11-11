import { Cart, CartModification, Country, Region } from '@spartacus/core';
import { TmaCartPrice, TmaOrderEntry } from './tma-cart.entry.model';
import { TmaProcessType } from './tma-product.model';

export interface TmaCartModification extends CartModification {
  deliveryModeChanged?: boolean;
  entry?: TmaOrderEntry;
  quantity?: number;
  quantityAdded?: number;
  statusCode?: string;
  statusMessage?: string;
  contractStartDate?: string;
  processType?: TmaProcessType;
  subscribedProduct?: TmaSubscribedProduct;
}

export enum TmaRelatedPartyRole {
  SERVICE_PROVIDER = 'SERVICE_PROVIDER'
}

export enum TmaPlaceRole {
  INSTALLATION_ADDRESS = 'INSTALLATION_ADDRESS'
}

export interface TmaCharacteristic {
  name?: string;
  value?: string;
}

export interface TmaSubscribedProduct {
  relatedParty?: TmaRelatedParty[];
  place?: TmaPlace[];
  characteristic?: TmaCharacteristic[];
}

export interface TmaRelatedParty {
  id?: string;
  role?: TmaRelatedPartyRole;
}

export interface TmaPlace {
  id?: string;
  name?: string;
  role?: TmaPlaceRole;
  country?: Country;
  region?: Region;
  line1?: string;
  line2?: string;
  town?: string;
  postalCode?: string;
}

export interface TmaCart extends Cart {
  entries?: TmaOrderEntry[];
  cartCosts?: TmaCartPrice[];
  rootGroups?: TmaRootGroup[];
  message?: TmaMessage[];
}

export interface TmaCartTotalPrice {
  currencyIso: string;
  payOnCheckoutSubTotal: number;
  payOnCheckoutTotal: number;
  deliveryCost: number;
}

export interface TmaRootGroup {
  groupNumber?: number;
  validationMessages?: TmaValidationMessage[];
}

export interface TmaValidationMessage {
  code?: string;
  message?: string;
}

export interface TmaMessage {
  type?: string;
  value?: string;
}

export enum TmaValidationMessageType {
  COMPATIBILITY = 'COMPATIBILITY'
}
