import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';
import {
  SUBSCRIPTION_BASE_FEATURE,
  SubscriptionBaseMap,
  SubscriptionBaseState,
  StateWithSubscriptionBase,
} from '../subscription-base.state';
import { SubscriptionBase } from '../../../../model';

export const getSubscriptionBaseFeatureState: MemoizedSelector<
  StateWithSubscriptionBase,
  SubscriptionBaseState
> = createFeatureSelector<SubscriptionBaseState>(SUBSCRIPTION_BASE_FEATURE);

export const getAllSubscriptionBase: MemoizedSelector<
  StateWithSubscriptionBase,
  SubscriptionBaseMap[]
> = createSelector(
  getSubscriptionBaseFeatureState,
  (state: SubscriptionBaseState) => state.subscriptionBaseMap
);

export const getSubscriptionBaseForUserId: MemoizedSelectorWithProps<
  StateWithSubscriptionBase,
  any,
  SubscriptionBase[]
> = createSelector(
  getAllSubscriptionBase,
  (state: SubscriptionBaseMap[], props: any) => {
    const subscription: SubscriptionBaseMap = state
      ? state.find(
          (subscriptionBase: SubscriptionBaseMap) =>
            subscriptionBase.userId === props.userId &&
            subscriptionBase.baseSiteId === props.baseSiteId
        )
      : undefined;
    return subscription ? subscription.subscription : [];
  }
);
