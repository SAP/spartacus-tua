import { Product } from '@spartacus/core';
import { TmaBillingPlan } from './tma-cart.entry.model';

export interface TmaProduct extends Product {
  productSpecification?: TmaProductSpecification;
  productOfferingPrice?: TmaProductOfferingPrice[];
  productSpecCharValues?: TmaProductSpecificationCharacteristicValue[];
  children?: TmaProduct[];
  isBundle?: boolean;
  offeringGroup?: TmaProductOfferingGroup[];
}

export interface TmaProcessType {
  id: TmaProcessTypeEnum;
}

export enum TmaProcessTypeEnum {
  ACQUISITION = 'ACQUISITION',
  DEVICE_ONLY = 'DEVICE_ONLY',
  RETENTION = 'RETENTION',
  SWITCH_SERVICE_PROVIDER = 'SWITCH_SERVICE_PROVIDER',
  TARIFF_CHANGE = 'TARIFF_CHANGE'
}

export interface TmaProductSpecification {
  id: string;
  name?: string;
  href?: string;
}

export interface TmaProductSpecificationCharacteristicValue {
  id?: string;
  unitOfMeasure?: string;
  value?: string;
}

export interface TmaProductOfferingPrice {
  id?: string;
  name?: string;
  itemType?: string;
  isBundle?: boolean;
  bundledPop?: TmaProductOfferingPrice[];
  isPriceOverride?: boolean;
  processType?: TmaProcessType[];
  productOfferingTerm?: TmaProductOfferingTerm[];
  recurringChargePeriodLength?: number;
  recurringChargePeriodType?: string;
  unitOfMeasure?: TmaMoney;
  price?: TmaMoney;
  billingEvent?: string;
  cycle?: TmaCycle;
  usageType?: string;
  chargeType?: string;
  usageUnit?: TmaUsageUnit;
  tierStart?: number;
  tierEnd?: number;
  region?: TmaRegion[];
}

export enum TmaPopChargeType {
  ONE_TIME = 'oneTime',
  RECURRING = 'recurring',
  USAGE = 'usage'
}

export enum TmaPopBillingEventType {
  ON_CANCELLATION = 'oncancellation',
  PAY_NOW = 'paynow',
  ON_FIRST_BILL = 'onfirstbill'
}

export enum TmaUsageType {
  EACH_RESPECTIVE_TIER = 'each_respective_tier',
  HIGHEST_APPLICABLE_TIER = 'highest_applicable_tier',
}

export enum TmaItemType {
  PER_UNIT_USAGE_CHARGE = 'PerUnitUsageCharge',
  VOLUME_USAGE_CHARGE = 'VolumeUsageCharge'
}

export interface TmaProductOfferingTerm {
  id?: string;
  name?: string;
  cancellable?: boolean;
  termOfServiceRenewal?: string;
  termOfServiceNumber?: string;
  termOfServiceFrequency?: string;
  billingPlan?: TmaBillingPlan;
  duration?: TmaQuantity;
}

export interface TmaMoney {
  currencyIso?: string;
  value?: string;
}

export interface TmaCycle {
  cycleStart?: number;
  cycleEnd?: number;
}

export interface TmaUsageUnit {
  id?: string;
  name?: string;
}

export interface TmaRegion {
  isocode?: string;
  isocodeShort?: string;
  countryIso?: string;
  name?: string;
  role?: string;
}

export interface TmaQuantity {
  amount?: number;
  units?: string;
}

export interface TmaProductOfferingGroup {
  id?: string;
  name?: string;
  childProductOfferings?: TmaProduct[];
}

export interface TmaBillingEvent {
  name?: string;
}
