import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';

export interface TmfProduct {
  id?: string;
  name?: string;
  startDate?: Date;
  status?: TmfProductStatus;
  terminationDate?: Date;
  relatedParty?: TmaTmfRelatedParty[];
  productOrder?: TmfProductOrder[];
  productRelationship?: TmfProductRelationship[];
  characteristic?: TmfProductCharacteristic[];
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
  id: string;
  name: string;
  href: string;
  publicIdentifier?: string;
  user: TmaTmfRelatedParty;
}
export interface TmaTimePeriod {
  startDateTime: Date;
  endDateTime: Date;
}
export interface TmfProductOrder {
  id?: string;
  orderItemId?: string;
}
export interface TmfProductCharacteristic {
  id?: string;
  name?: string;
  value?: string;
}
