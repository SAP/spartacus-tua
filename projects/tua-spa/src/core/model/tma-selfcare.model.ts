import { ContactMedium } from './appointment.model';
import { ProductRef } from './subscription-base.model';
import { TimePeriod } from './time-period.model';
import { TmaProductPrice } from './tma-price.model';
import {
  TmaProductCharacteristic,
  TmaProductOfferingTerm,
  TmaProductRelationship
} from './tma-product.model';
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';

export interface TmaAmount {
  value?: string;
  unit?: string;
}

export interface TmaAgreeement {
  id: string;
  href: string;
  agreementId: string;
  name: string;
}

export interface TmaSPISpecification {
  id: string;
  name?: string;
  href?: string;
}


export interface TmaBillingAccount {
  id: string;
  href: string;
  name: string;
}

export interface TmaSelfcareProductOffering {
  id: string;
  href: string;
  name: string;
}

export interface TmaProductOrderItem {
  orderItemAction: string;
  orderItemId: string;
  productOrderHref: string;
  productOrderId: string;
  role: string;
}

export interface TmaSubscriptionPrice {
  taxRate: string;
  dutyFreeAmount: TmaAmount;
  taxIncludedAmount: TmaAmount;
}

export interface TmaSelfcareSubscriptions {
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
  agreement?: TmaAgreeement[];
  billingAccount: TmaBillingAccount;
  product?: ProductRef[];
  productCharacteristic?: TmaProductCharacteristic[];
  productOffering: TmaSelfcareProductOffering;
  productOrderItem: TmaProductOrderItem[];
  productPrice: TmaProductPrice;
  productRelationship: TmaProductRelationship;
  productSpecification?: TmaSPISpecification;
  productTerm: TmaProductOfferingTerm[];
  relatedParty: TmaTmfRelatedParty[];
  status: Boolean;
}

export interface TmaSubscribedProductsInventory {
  subscribedProducts: TmaSelfcareSubscriptions[];
  childrens: TmaSelfcareSubscriptions[];
}

export interface TmaSelfcareSubscriptionsTreeNode
  extends TmaSelfcareSubscriptions {
  expanded: boolean;
  depthLevel: number;
  count: number;
  // consider dropping, as this overlaps the `B2BUnitNode.id`
  uid: string;
}

export enum TREE_TOGGLE {
  EXPANDED,
  COLLAPSED
}

export interface EntitiesModel<T> {
  values: T[];
}

// Selfcare Billing Account

export interface TmaAccountBalance {
  balanceType: string;
  amount: TmaAmount;
  validFor: TimePeriod;
}

export interface TmaAccountRelationship {
  relationshipType: string;
  account: TmaBillingAccount;
}

export interface TmaFormat {
  id: string;
  href: string;
  name: string;
  description: string;
  isRef: boolean;
}

export interface TmaCellSpecification {
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

export interface TmaBillStructure {
  cycleSpecification: TmaCellSpecification;
  format: TmaFormat;
  presentationMedia: TmaFormat[];
}

export interface TmaContact {
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
  paymentMethod: TmaBillingAccount;
  totalAmount: TmaAmount;
  validFor: TimePeriod;
}

export interface TmaTaxExamption {
  certificateNumber: string;
  issuingJurisdiction: string;
  reason: string;
  validFor: TimePeriod;
}

export interface TmaSelfcareBillingAccounts {
  id: string;
  href: string;
  accountType: string;
  description: string;
  name: string;
  paymentStatus: string;
  ratingType: string;
  accountBalance: TmaAccountBalance[];
  accountRelationship: TmaAccountRelationship[];
  billStructure: TmaBillStructure;
  contact: TmaContact[];
  creditLimit: TmaAmount;
  defaultPaymentMethod: TmaBillingAccount;
  financialAccount: TmaBillingAccount;
  paymentPlan: TmaPaymentPlan[];
  relatedProperty: TmaTmfRelatedParty[];
  taxExamption: TmaTaxExamption[];
}
