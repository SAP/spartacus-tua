import { BaseStore, Language, Product } from '@spartacus/core';
import { ContactMedium } from '../../model/appointment.model';
import { TimePeriod } from '../../model/time-period.model';
import { TmfRelatedParty } from '../../tmf-resource-pool-management';

export namespace Tmf {
  export interface TmaChecklistAction {
    id: string;
    name: string;
    actionType: string;
    productOffering?: TmfProductOfferingRef[];
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
    productOffering?: TmfProductOfferingRef;
  }

  export enum TmfProductStatus {
    CREATED = 'CREATED',
    PENDINGACTIVE = 'PENDINGACTIVE',
    CANCELLED = 'CANCELLED',
    ACTIVE = 'ACTIVE',
    PENDINGTERMINATE = 'PENDINGTERMINATE',
    TERMINATED = 'TERMINATED',
    SUSPENDED = 'SUSPENDED',
    ABORTED = 'ABORTED'
  }

  export enum TmfProductRelatedPartyRole {
    OWNER = 'OWNER',
    ADMINISTRATOR = 'ADMINISTRATOR',
    BENEFICIARY = 'BENEFICIARY'
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

  export interface TmfProductOfferingRef {
    id: string;
    href?: string;
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
    UPDATE = 'UPDATE'
  }

  export interface TmaTmfRelatedParty {
    id: string;
    href: string;
    role?: string;
    name?: string;
  }

  export interface TmfRecommendation {
    id?: string;
    name?: string;
    href?: string;
    item?: TmfRecommendationItem[];
  }

  export interface TmfRecommendationItem {
    offering?: TmfProductOfferingRef;
    price?: TmfProductOfferingPrice;
  }

  export interface TmfPrice {
    value?: string;
    unit?: string;
  }

  export interface TmfProductOfferingPrice {
    id?: string;
    name?: string;
    itemType?: string;
    isBundle?: boolean;
    bundledPop?: TmfProductOfferingPrice[];
    isPriceOverride?: boolean;
    priceType?: string;
    priceEvent?: string;
    percentage?: string;
    price?: TmfPrice;
  }

  export interface TmfGeographicAddress {
    id?: string;
    href?: string;
    streetNr?: string;
    streetNrLast?: string;
    streetNrLastSuffix?: string;
    streetName?: string;
    streetType?: string;
    streetSuffix?: string;
    postcode?: string;
    locality?: string;
    city?: string;
    stateOfProvince?: string;
    country?: string;
    relatedParty: TmaTmfRelatedParty;
    geographicSubAddress?: TmfGeographicSubAddress;
    isInstallationAddress?: boolean;
    isUnloadingAddress?: boolean;
    isContactAddress?: boolean;
    isShippingAddress?: boolean;
    isBillingAddress?: boolean;
  }

  export interface TmfGeographicSubAddress {
    id?: string;
    href?: string;
    name?: string;
    type?: string;
    subUnitType?: string;
    subUnitNumber?: string;
    levelType?: string;
    levelNumber?: string;
    buildingName?: string;
    privateStreetNumber?: string;
    privateStreetName?: string;
  }

  export interface TmfProductOffering {
    id: string;
    href: string;
    name: string;
    description: string;
    isBundle: boolean;
    isSellable: boolean;
    productOfferingPrice?: TmfProductOfferingPrice[];
    children?: TmfProductOffering[];
    priceContext?: TmfPriceContext[];
  }

  export interface TmfPriceContext {
    id: string;
    poRelationship: TmfProductRelationship;
    isPriceOverride: string;
    productOfferingPrice: TmfProductOfferingPriceRef;
    isBundle: boolean;
    isSellable: boolean;
    productOfferingTerm: TmfProductOfferingTerm[];
    processType: TmfProcessType;
    priority: number;
    relatedParty: TmfRelatedParty;
  }

  export interface TmfProductOfferingPriceRef {
    id: string;
    href: string;
    name: string;
  }

  export interface TmfProductOfferingTerm {
    id: string;
    description: string;
    name: string;
    duration: string;
    validFor: string;
  }

  export interface TmfProcessType {
    id: TmfProcessTypeEnum;
  }

  export interface TmfAgreeement {
    id: string;
    href: string;
    agreementId: string;
    name: string;
  }

  export interface TmfBillingAccount {
    id: string;
    href: string;
    name: string;
  }

  export interface TmfProductCharacteristic {
    name: string;
    valueType: string;
    value: string;
  }

  export interface TmfSelfcareProductOffering {
    id: string;
    href: string;
    name: string;
  }

  export interface TmfProductOrderItem {
    orderItemAction: string;
    orderItemId: string;
    productOrderHref: string;
    productOrderId: string;
    role: string;
  }

  export interface TmfSubscriptionPrice {
    taxRate: string;
    dutyFreeAmount: TmfPrice;
    taxIncludedAmount: TmfPrice;
  }

  export interface TmfProductPrice {
    name: string;
    priceType: string;
    recurringChargePeriod: string;
    billingAccount: TmfBillingAccount;
    price: TmfSubscriptionPrice;
    productOfferingPrice: TmfProductOffering;
  }

  export interface TmfProductRelationship {
    relationshipType: string;
    product: TmfSelfcareProductOffering;
  }

  export interface TmfProductSpecification {
    id: string;
    href: string;
    name: string;
    version: string;
  }

  export interface TmfSelfcareSubscriptions {
    id: string;
    href: string;
    description: string;
    isBundle: Boolean;
    isCustomerVisible: Boolean;
    name: string;
    orderDate: Date;
    productSerialNumber: string;
    startDate: Date;
    terminationDate: Date;
    agreement?: TmfAgreeement[];
    billingAccount: TmfBillingAccount;
    product?: TmfProductRef[];
    productCharacteristic?: TmfProductCharacteristic[];
    productOffering: TmfSelfcareProductOffering;
    productOrderItem: TmfProductOrderItem[];
    productPrice: TmfProductPrice;
    productRelationship: TmfProductRelationship;
    productSpecification?: TmfProductSpecification;
    productTerm: TmfProductOfferingTerm[];
    relatedParty: TmaTmfRelatedParty[];
    status: Boolean;
  }

  export interface TmfSubscribedProductsInventory {
    subscribedProducts: TmfSelfcareSubscriptions[];
    childrens: TmfSelfcareSubscriptions[];
  }

  export enum TmfProcessTypeEnum {
    ACQUISITION = 'ACQUISITION',
    DEVICE_ONLY = 'DEVICE_ONLY',
    RETENTION = 'RETENTION',
    SWITCH_SERVICE_PROVIDER = 'SWITCH_SERVICE_PROVIDER',
    TARIFF_CHANGE = 'TARIFF_CHANGE',
    RENEWAL = 'RENEWAL'
  }

  // Selfcare Billing Accounts
  export interface TmfAccountBalance {
    balanceType: string;
    amount: TmfPrice;
    validFor: TimePeriod;
  }

  export interface TmfAccountRelationship {
    relationshipType: string;
    account: TmfBillingAccount;
  }

  export interface TmfFormat {
    id: string;
    href: string;
    name: string;
    description: string;
    isRef: boolean;
  }

  export interface TmfCellSpecification {
    id: string;
    href: string;
    billingDateShift: number;
    billingPeriod: string;
    chargeDateOffset: number;
    creditDateOffset: number;
    dateShift: number;
    description: string;
    frequency: boolean;
    isRef: boolean;
    mailingDateOffset: string;
    name: string;
    paymentDueDateOffset: number;
    validFor: TimePeriod;
  }

  export interface TmfBillStructure {
    cycleSpecification: TmfCellSpecification;
    format: TmfFormat;
    presentationMedia: TmfFormat[];
  }

  export interface TmfContact {
    contactName: string;
    contactType: string;
    partyRoleType: string;
    contactMedium: ContactMedium[];
    relatedParty: TmaTmfRelatedParty;
    validFor: TimePeriod;
  }

  export interface TmaPaymentPlan {
    numberOfPayments: number;
    paymentFrequency: string;
    planType: string;
    priority: number;
    status: string;
    paymentMethod: TmfBillingAccount;
    totalAmount: TmfPrice;
    validFor: TimePeriod;
  }

  export interface TmfTaxExamption {
    certificateNumber: string;
    issuingJurisdiction: string;
    reason: string;
    validFor: TimePeriod;
  }

  export interface TmfSelfcareBillingAccounts {
    id: string;
    href: string;
    accountType: string;
    description: string;
    name: string;
    paymentStatus: string;
    ratingType: string;
    accountBalance: TmfAccountBalance[];
    accountRelationship: TmfAccountRelationship[];
    billStructure: TmfBillStructure;
    contact: TmfContact[];
    creditLimit: TmfPrice;
    defaultPaymentMethod: TmfBillingAccount;
    financialAccount: TmfBillingAccount;
    paymentPlan: TmaPaymentPlan[];
    relatedProperty: TmaTmfRelatedParty[];
    taxExamption: TmfTaxExamption[];
  }
}
