import { Action } from '@ngrx/store';

export enum SelfcareActionTypes {
  LOAD_SELFCARE_SUBSCRIPTIONS = '[Selfcare-subscriptions] Load Selfcare Subscriptions',
  LOAD_SELFCARE_SUBSCRIPTIONS_SUCCESS = '[Selfcare-subscriptions] Load Selfcare Subscriptions Success',
  LOAD_SELFCARE_SUBSCRIPTIONS_FAIL = '[Selfcare-subscriptions] Load Selfcare Subscriptions Fail',
  CLEAR_SELFCARE_SUBSCRIPTIONS = '[Selfcare-subscriptions] Clear Selfcare Subscriptions',
  LOAD_SELFCARE_BILLING_ACCOUNTS = '[Selfcare-billing-accounts] Load Selfcare Billing Accounts',
  LOAD_SELFCARE_BILLING_ACCOUNTS_SUCCESS = '[Selfcare-billing-accounts] Load Selfcare Billing Accounts Success',
  LOAD_SELFCARE_BILLING_ACCOUNTS_FAIL = '[Selfcare-billing-accounts] Load Selfcare Billing Accounts Fail',
  CLEAR_SELFCARE_BILLING_ACCOUNTS = '[Selfcare-billing-accounts] Clear Selfcare Billing Accounts'
}

export class LoadSelfcareSubscriptions implements Action {
  readonly type = SelfcareActionTypes.LOAD_SELFCARE_SUBSCRIPTIONS;
  constructor() {}
}

export class LoadSelfcareSubscriptionsSuccess implements Action {
  readonly type = SelfcareActionTypes.LOAD_SELFCARE_SUBSCRIPTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadSelfcareSubscriptionsFail implements Action {
  readonly type = SelfcareActionTypes.LOAD_SELFCARE_SUBSCRIPTIONS_FAIL;
  constructor(public payload: any) {}
}

export class ClearSelfcareSubscriptionsState implements Action {
  readonly type = SelfcareActionTypes.CLEAR_SELFCARE_SUBSCRIPTIONS;
  constructor() {}
}

// Billing Accounts
export class LoadSelfcareBillingAccounts implements Action {
  readonly type = SelfcareActionTypes.LOAD_SELFCARE_BILLING_ACCOUNTS;
  constructor() {}
}

export class LoadSelfcareBillingAccountsSuccess implements Action {
  readonly type = SelfcareActionTypes.LOAD_SELFCARE_BILLING_ACCOUNTS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadSelfcareBillingAccountsFail implements Action {
  readonly type = SelfcareActionTypes.LOAD_SELFCARE_BILLING_ACCOUNTS_FAIL;
  constructor(public payload: any) {}
}

export class ClearSelfcareBillingAccountsState implements Action {
  readonly type = SelfcareActionTypes.CLEAR_SELFCARE_BILLING_ACCOUNTS;
  constructor() {}
}

export type SelfcareActions =
  | LoadSelfcareSubscriptions
  | LoadSelfcareSubscriptionsSuccess
  | LoadSelfcareSubscriptionsFail
  | ClearSelfcareSubscriptionsState
  | LoadSelfcareBillingAccounts
  | LoadSelfcareBillingAccountsSuccess
  | LoadSelfcareBillingAccountsFail
  | ClearSelfcareBillingAccountsState;
