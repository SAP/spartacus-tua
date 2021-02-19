import { CartModification } from '@spartacus/core';
import { TmaOrderEntry } from './tma-cart.entry.model';
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
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export enum TmaPlaceRole {
  INSTALLATION_ADDRESS = 'INSTALLATION_ADDRESS',
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
}
