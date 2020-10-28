import { OrderEntry, Price, Region } from '@spartacus/core';
import { TmaSubscribedProduct } from './tma-cart.model';
import { TmaCycle, TmaProcessType } from './tma-product.model';
import { Appointment } from './appointment.model';

export enum TmaActionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
}

export enum TmaBillingTimeType {
  PAY_NOW = 'paynow',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum TmaChargeType {
  ONE_TIME = 'oneTime',
  RECURRING = 'recurring',
  USAGE = 'usage',
}

export enum TmaPriceType {
  DISCOUNT = 'DISCOUNT',
  DELIVERY_COST = 'DELIVERY_COST',
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
  id: string;
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
  childPrices?: TmaChildCartPrice[];
  usageChargeType?: string;
  parentId?: string;
}

export interface TmaOrderEntry extends OrderEntry {
  action?: TmaActionType;
  appointmentId?: string;
  appointment?: Appointment;
  processType?: TmaProcessType;
  subscribedProduct?: TmaSubscribedProduct;
  subscriptionTerm?: TmaSubscriptionTerm;
  contractStartDate?: string;
  entryGroupNumbers?: number;
  region?: Region;
  rootBpoCode?: string;
  cartPrice?: TmaCartPrice;
}

export interface TmaChildCartPrice {
  taxIncludedAmount?: TmaTaxIncludedAmount;
  billingTime?: TmaBillingTime;
}

export interface TmaTaxIncludedAmount {
  value?: string;
  currencyIso?: string;
  formattedValue?: string;
}

export interface TmaBillingTime {
  name?: string;
}

export interface TmaCartItemPrice {
  currencyIso: string;
  payOnCheckoutPrice: number;
  recurringPrices: TmaCartPrice[];
  usageChargePrices: TmaCartPrice[];
  oneTimeChargePrices: TmaCartPrice[];
}
