import {
  TmaSelfcareBillingAccounts,
  TmaSubscribedProductsInventory
} from '../../model';

export const SELFCARE_FEATURE = 'Selfcare';

export interface StateWithSelfcare {
  [SELFCARE_FEATURE]: SelfcareState;
}

export interface SelfcareSubscriptionsMap {
  productId?: string;
  selfcareSubscriptions: TmaSubscribedProductsInventory;
  error?: SelfcareSubscriptionsError;
}

export interface SelfcareBillingAccountsMap {
  billingAccountId?: string;
  billingAccounts: TmaSelfcareBillingAccounts[];
}

export interface SelfcareSubscriptionsError {
  SelfcareSubscriptionsError?: string;
}

export interface SelfcareState {
  selfcareSubscriptionsMap: SelfcareSubscriptionsMap[];
  selfcareBillingAccountsMap: SelfcareBillingAccountsMap[];
}
