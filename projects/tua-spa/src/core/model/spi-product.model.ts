import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';

export interface SpiProduct {
  id?: string;
  href?: string;
  name?: string;
  description?: string;
  isCustomerVisible?: boolean;
  isBundle?: boolean;
  orderDate?: Date;
  productSerialNumber?: string;
  startDate?: Date;
  terminationDate?: Date;
  status?: SpiProductStatusType;
  billingAccount?: SpiBillingAccount;
  productOffering?: SpiProductOffering;
  productOrderItem?: SpiProductOrderItem[];
  productPrice?: SpiProductPrice[];
  productTerm?: SpiProductTerm[];
  relatedParty?: TmaTmfRelatedParty[];
  '@schemaLocation'?: string;
  '@type'?: string;
}

export interface SpiBillingAccount {
  id?: string;
  href?: string;
  name?: string;
  '@schemaLocation'?: string;
  '@referredType'?: string;
}

export enum SpiProductStatusType {
  CREATED = 'created',
  CANCELLED = 'cancelled',
  PENDING_ACTIVE = 'pending_active',
  ACTIVE = 'active',
  PENDINGTERMINATE = 'pendingterminate',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
  ABORTED = 'aborted'
}

export interface SpiProductOffering {
  id?: string;
  href?: string;
  name?: string;
  '@schemaLocation'?: string;
  '@referredType'?: string;
}
export interface SpiProductTerm {
  description?: string;
  name?: string;
  validFor?: ValidFor;
  '@schemaLocation'?: string;
  '@type'?: string;
}
export interface ValidFor {
  endDateTime?: Date;
  startDateTime?: Date;
}

export interface SpiProductOrderItem {
  orderItemAction?: string;
  orderItemId?: string;
  productOrderHref?: string;
  productOrderId?: string;
  role?: string;
  '@schemaLocation'?: string;
  '@referredType'?: string;
}

export interface SpiProductPrice {
  name?: string;
  priceType?: string;
  recurringChargePeriod?: string;
  billingAccount?: SpiBillingAccount;
  price?: SpiPrice;
  productOfferingPrice?: SpiProductOfferingPrice;
  '@schemaLocation'?: string;
  '@type'?: string;
}
export interface SpiPrice {
  taxRate?: string;
  dutyFreeAmount?: Amount;
  taxIncludedAmount?: Amount;
  '@schemaLocation'?: string;
  '@type'?: string;
}

export interface Amount {
  unit?: string;
  value?: string;
}

export interface SpiProductOfferingPrice {
  id?: string;
  href?: string;
  name?: string;
  '@schemaLocation'?: string;
  '@referredType'?: string;
}
