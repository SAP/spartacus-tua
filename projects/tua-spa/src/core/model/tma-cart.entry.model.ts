import { OrderEntry, Price, Region } from '@spartacus/core';
import { TmaSubscribedProduct } from './tma-cart.model';
import { TmaCycle, TmaProcessType } from './tma-product.model';

export enum TmaActionTypeEnum {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
}

export enum TmaBillingTimeEnum {
  PayNow = 'paynow',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum TmaChargeTypeEnum {
  OneTime = 'oneTime',
  Recurring = 'recurring',
  Usage = 'usage',
}

export enum TmaPriceTypeEnum {
  discount = 'DISCOUNT',
  productPrice = 'PRODUCT_PRICE',
  deliveryCost = 'DELIVERY_COST'
}

export interface TmaDuration {
  amount?: number;
  units?: string;
}

export interface TmaBillingPlan {
  billingCycleDay?: number;
  billingCycleType?: string;
  billingTime?: string;
  name?: string;
}

export interface TmaSubscriptionTerm {
  billingPlan?: TmaBillingPlan;
  id?: string;
  name?: string;
  duration?: TmaDuration;
  termOfServiceFrequency?: string;
  termOfServiceNumber?: number;
  termOfServiceRenewal?: string;
  cancellable?: boolean;
}

export interface TmaCartPrice {
  name: string;
  description: string;
  priceType: string;
  recurringChargePeriod: string;
  chargeType: string;
  unitOfMeasure: string;
  dutyFreeAmount: Price;
  taxIncludedAmount: Price;
  cartPrice: TmaCartPrice[];
  cycle: TmaCycle;
  tierStart: string;
  tierEnd: string;
}

export interface TmaOrderEntry extends OrderEntry {
  action?: TmaActionTypeEnum;
  appointmentId?: string;
  processType?: TmaProcessType;
  subscribedProduct?: TmaSubscribedProduct;
  subscriptionTerm?: TmaSubscriptionTerm;
  contractStartDate?: string;
  entryGroupNumbers?: number;
  region?: Region;
  rootBpoCode?: string;
  cartPrice?: TmaCartPrice;
}

export interface TmaCartItemPrice {
  currencyIso: string;
  payOnCheckoutPrice: number;
  recurringPrices: TmaCartPrice[];
  usageChargePrices: TmaCartPrice[];
  oneTimeChargePrices: TmaCartPrice[];
}
