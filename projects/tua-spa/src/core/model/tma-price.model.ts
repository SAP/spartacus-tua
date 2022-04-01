import { TmaCycle, TmaPriorityType, TmaTmfMoney } from './tma-common.model';
import { TmaProductOfferingPriceRef } from './tma-product-offering.model';
import { TmaBillingAccountRef } from './tma-billing-account.model';

export interface TmaPriceAlteration {
  '@baseType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
  applicationDuration?: number;
  cycle?: TmaCycle;
  description?: string;
  name?: string;
  price?: TmaPrice;
  priceType?: string;
  priority?: TmaPriorityType;
  productOfferingPrice?: TmaProductOfferingPriceRef;
  recurringChargePeriod?: TmaRecurringChargePeriod;
  unitOfMeasure?: string;
}

export interface TmaPrice {
  '@schemaLocation'?: string;
  '@type'?: string;
  dutyFreeAmount?: TmaTmfMoney;
  percentage?: number;
  taxIncludedAmount?: TmaTmfMoney;
  taxRate?: number;
}

export interface TmaProductPrice {
  '@schemaLocation'?: string;
  '@type'?: string;
  billingAccount?: TmaBillingAccountRef;
  description?: string;
  id?: string;
  name?: string;
  price?: TmaPrice;
  priceType?: string;
  prodPriceAlteration?: TmaPriceAlteration;
  recurringChargePeriod?: TmaRecurringChargePeriod;
  unitOfMeasure?: string;
}

export enum TmaRecurringChargePeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  PAY_NOW = 'paynow',
  ON_FIRST_BILL = 'onfirstbill',
  ON_CANCELATION = 'oncancellation'
}
