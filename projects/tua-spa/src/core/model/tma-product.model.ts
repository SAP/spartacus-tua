import { Product } from '@spartacus/core';
import { TmaBillingPlan } from './tma-cart.entry.model';

export interface TmaProduct extends Product {
    productSpecification?: TmaProductSpecification,
    productOfferingPrice?: TmaProductOfferingPrice[],
    productSpecCharValues?: TmaProductSpecificationCharacteristicValue[];
}

export interface TmaProcessType {
    id: TmaProcessTypeEnum;
}

export enum TmaProcessTypeEnum {
    ACQUISITION = 'ACQUISITION',
    DEVICE_ONLY = 'DEVICE_ONLY',
    RETENTION = 'RETENTION',
    SWITCH_SERVICE_PROVIDER = 'SWITCH_SERVICE_PROVIDER',
    TARIFF_CHANGE = 'TARIFF_CHANGE',
}


export interface TmaProductSpecification {
    id: string,
    name?: string,
    href?: string,
}

export interface TmaProductSpecificationCharacteristicValue {
    id?: string,
    unitOfMeasure?: string,
    value?: string,
}

export interface TmaProductOfferingPrice {
    id?: string,
    name?: string,
    itemType?: string,
    isBundle?: boolean,
    bundledPop?: TmaProductOfferingPrice[],
    isPriceOverride?: boolean,
    processType?: TmaProcessType[],
    productOfferingTerm?: TmaProductOfferingTerm[],
    recurringChargePeriodLength?: number,
    recurringChargePeriodType?: string,
    unitOfMeasure?: TmaMoney,
    price?: TmaMoney,
    billingEvent?: string,
    cycle?: TmaCycle,
    usageType?: string,
    chargeType?: string,
    usageUnit?: TmaUsageUnit,
    tierStart?: number,
    tierEnd?: number,
    region?: TmaRegion[],
}

export interface TmaProductOfferingTerm {
    id?: string,
    name?: string,
    cancellable?: boolean,
    termOfServiceRenewal?: string,
    termOfServiceNumber?: string,
    termOfServiceFrequency?: string,
    billingPlan?: TmaBillingPlan,
    duration?: TmaQuantity,
}

export interface TmaMoney {
    currencyIso?: string,
    value?: string,
}

export interface TmaCycle {
    cycleStart?: number,
    cycleEnd?: number,
}

export interface TmaUsageUnit {
    id?: string,
    name?: string,
}

export interface TmaRegion {
    isocode?: string,
    isocodeShort?: string,
    countryIso?: string,
    name?: string,
    role?: string,
}

export interface TmaQuantity {
    amount?: number,
    unit?: string,
}

export interface TmaBillingEvent {
    name?: string;
}
