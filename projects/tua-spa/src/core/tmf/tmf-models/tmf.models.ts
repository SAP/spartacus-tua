import { BaseStore, Language, Product } from '@spartacus/core';

export namespace Tmf {
  export interface TmaChecklistAction {
    id: string;
    name: string;
    actionType: string;
  }

  export interface BaseSites {
    baseSites?: BaseSite[];
  }

  export interface BaseSite {
    channel?: string;
    defaultLanguage?: Language;
    defaultPreviewCatalogId?: string;
    defaultPreviewCategoryCode?: string;
    defaultPreviewProductCode?: string;
    locale?: string;
    name?: string;
    theme?: string;
    uid?: string;
    stores?: BaseStore[];
    urlPatterns?: string[];
    urlEncodingAttributes?: string[];
  }

  export interface TmfSubscriptionBase {
    id: string;
    subscriberIdentity: string;
    subscriptionAccess: TmfSubscriptionAccess[];
  }

  export interface TmfSubscriptionBaseDetail {
    subscriptionBase: TmfSubscriptionBaseRef;
    user: TmaTmfRelatedParty;
  }

  export interface TmfSubscriptionAccess {
    accessType?: TmfAccessType;
    subscriptionBase?: TmfSubscriptionBaseRef;
    relatedParty?: TmaTmfRelatedParty;
  }

  export interface TmfAccessType {
    value?: string;
  }

  export interface TmfSubscriptionBaseRef {
    product?: TmfProductRef[];
    relatedPartyRef?: TmaTmfRelatedParty[];
    id?: string;
    accessType?: string;
  }

  export interface TmfProductRef {
    id?: string;
    name?: string;
    href?: string;
    publicIdentifier?: string;
    user?: TmaTmfRelatedParty;
  }

  export interface TmfProduct {
    id: string;
    name: string;
    productRelationship?: TmfProductRelationship[];
    startDate?: Date;
    status?: TmfProductStatus;
    terminationDate?: Date;
    relatedParty?: TmaTmfRelatedParty[];
    productOrder?: TmfProductOrder[];
    productOffering?: TmfProductOffering;
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

  export interface TmfUsageConsumptionReport {
    bucket: TmfBucketRef[];
  }

  export interface TmfBucketRef {
    bucketBalance?: TmfBucketBalanceRef[];
    bucketCounter?: TmfBucketCounterRef[];
    id?: string;
    name?: string;
    usageType?: string;
    product?: Product;
  }

  export interface TmfBucketBalanceRef {
    remainingValue?: number;
    remainingValueLabel?: string;
    unit?: string;
    validFor?: TmaTimePeriod;
  }

  export interface TmfBucketCounterRef {
    value?: number;
    valueLabel?: string;
    unit?: string;
    validFor?: TmaTimePeriod;
  }

  export interface TmfProductOffering {
    href?: string;
    id: string;
    name?: string;
  }

  export interface TmaTmfShoppingCart {
    id: string;
    href: string;
    baseSiteId: string;
    cartItem?: TmaTmfCartItem[];
    relatedParty?: TmaTmfRelatedParty[];
  }

  export interface TmaTmfCartItem {
    id: string;
    action?: TmaTmfActionType;
    quantity?: number;
    cartItem?: TmaTmfCartItem[];
  }

  export enum TmaTmfActionType {
    ADD = 'ADD',
    UPDATE = 'UPDATE',
  }

  export interface TmaTmfRelatedParty {
    id: string;
    href: string;
    role?: string;
    name?: string;
  }
}
