import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps
} from '@ngrx/store';
import {
  TmaSelfcareBillingAccounts,
  TmaSelfcareSubscriptions,
  TmaSubscribedProductsInventory
} from '../../../model';
import {
  SelfcareBillingAccountsMap, SelfcareState,
  SelfcareSubscriptionsMap, SELFCARE_FEATURE, StateWithSelfcare
} from '../selfcare-state';

// Selfcare Subscriptions
export const getSelfcareFeatureState: MemoizedSelector<
  StateWithSelfcare,
  SelfcareState
> = createFeatureSelector<SelfcareState>(SELFCARE_FEATURE);

export const getSelfcareSubscriptionsMap: MemoizedSelector<
  StateWithSelfcare,
  SelfcareSubscriptionsMap[]
> = createSelector(
  getSelfcareFeatureState,
  (state: SelfcareState) => state.selfcareSubscriptionsMap
);

export const getSelfcareSubscriptions: MemoizedSelectorWithProps<
  StateWithSelfcare,
  any,
  TmaSubscribedProductsInventory
> = createSelector(
  getSelfcareSubscriptionsMap,
  (state: SelfcareSubscriptionsMap[], props) => {
    const selfcare: SelfcareSubscriptionsMap = state.find(
      (selfcareState) => selfcareState.selfcareSubscriptions
    );

    return selfcare ? selfcare.selfcareSubscriptions : undefined;
  }
);

export const getSubscribedProduct: MemoizedSelectorWithProps<
  StateWithSelfcare,
  any,
  TmaSelfcareSubscriptions
> = createSelector(
  getSelfcareSubscriptionsMap,
  (state: SelfcareSubscriptionsMap[], props) => {
    const selfcare: SelfcareSubscriptionsMap = state.find(
      (selfcareState) => selfcareState.selfcareSubscriptions
    );
    if (!selfcare) return undefined;
    const subscribedProduct =
      selfcare.selfcareSubscriptions.subscribedProducts.find(
        (product: TmaSelfcareSubscriptions) => product.name === props.productId
      );
    if (!subscribedProduct) {
      // check product in childrens
      const product = selfcare.selfcareSubscriptions.childrens.find(
        (children: TmaSelfcareSubscriptions) =>
          children.name === props.productId
      );
      if (!product) return undefined;
      return product;
    }
    return subscribedProduct;
  }
);

// Billing Accounts
export const getSelfcareBillingAccountsMap: MemoizedSelector<
  StateWithSelfcare,
  SelfcareBillingAccountsMap[]
> = createSelector(
  getSelfcareFeatureState,
  (state: SelfcareState) => state.selfcareBillingAccountsMap
);

export const getSelfcareBillingAccounts: MemoizedSelectorWithProps<
  StateWithSelfcare,
  any,
  TmaSelfcareBillingAccounts[]
> = createSelector(
  getSelfcareBillingAccountsMap,
  (state: SelfcareBillingAccountsMap[], props: any) => {
    const selfcare: SelfcareBillingAccountsMap = state
      ? state.find((selfcareState) => selfcareState.billingAccounts)
      : undefined;

    return selfcare ? selfcare.billingAccounts : [];
  }
);
