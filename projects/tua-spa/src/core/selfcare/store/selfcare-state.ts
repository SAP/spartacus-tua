import {
  TmaBillingAccounts,
  TmaBillingAgreements,
  TmaSubscribedProductsInventory
} from '../../model';

export const SELFCARE_FEATURE = 'Selfcare';

export interface StateWithSelfcare {
  [SELFCARE_FEATURE]: SelfcareState;
}

export interface SubscriptionsMap {
  productId?: string;
  subscriptions: TmaSubscribedProductsInventory;
  error?: SubscriptionsError;
}

export interface BillingAccountsMap {
  billingAccountId?: string;
  billingAccounts: TmaBillingAccounts[];
}

export interface BillingAgreementsMap {
  billingAgreementId?: string;
  billingAgreements: TmaBillingAgreements[];
}

export interface SubscriptionsError {
  SubscriptionsError?: string;
}

export interface SelfcareState {
  subscriptionsMap: SubscriptionsMap[];
  billingAccountsMap: BillingAccountsMap[];
  billingAgreementsMap: BillingAgreementsMap[];
}
