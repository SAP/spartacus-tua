import {
  SelfcareActions,
  SelfcareActionTypes
} from '../actions/selfcare.actions';
import {
  SelfcareBillingAccountsMap,
  SelfcareSubscriptionsMap
} from '../selfcare-state';

export const selfcareSubscriptionsInitialState: SelfcareSubscriptionsMap[] = [];
export const selfcareBillingAccountsInitialState: SelfcareBillingAccountsMap[] =
  [];

/**
 * Selfcare Subscriptions Reducer
 * @param state
 * @param action
 * @returns SelfcareSubscriptions State
 */
export function SelfcareSubscriptionsReducer(
  state = selfcareSubscriptionsInitialState,
  action: SelfcareActions
): SelfcareSubscriptionsMap[] {
  switch (action.type) {
    case SelfcareActionTypes.LOAD_SELFCARE_SUBSCRIPTIONS_SUCCESS: {
      state = state.concat({
        selfcareSubscriptions: action.payload.selfcareSubscriptions
      });
      return state;
    }
    case SelfcareActionTypes.LOAD_SELFCARE_SUBSCRIPTIONS_FAIL ||
      SelfcareActionTypes.CLEAR_SELFCARE_SUBSCRIPTIONS: {
      state = selfcareSubscriptionsInitialState;
      return state;
    }
  }
  return state;
}

/**
 * SelfcareBillingAccounts Reducer
 * @param state
 * @param action
 * @returns SelfcareBillingAccounts State
 */
export function SelfcareBillingAccountsReducer(
  state = selfcareBillingAccountsInitialState,
  action: SelfcareActions
): SelfcareBillingAccountsMap[] {
  switch (action.type) {
    case SelfcareActionTypes.LOAD_SELFCARE_BILLING_ACCOUNTS_SUCCESS: {
      state = state.concat({
        billingAccounts: action.payload.billingAccounts
      });
      return state;
    }
    case SelfcareActionTypes.LOAD_SELFCARE_BILLING_ACCOUNTS_FAIL ||
      SelfcareActionTypes.CLEAR_SELFCARE_BILLING_ACCOUNTS: {
      state = selfcareBillingAccountsInitialState;
      return state;
    }
  }
  return state;
}
