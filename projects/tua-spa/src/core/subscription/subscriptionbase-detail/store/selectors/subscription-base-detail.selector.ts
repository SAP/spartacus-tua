import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';
import {
  SUBSCRIPTION_BASE_DETAIL_FEATURE,
  SubscriptionBaseDetailMap,
  SubscriptionBaseDetailState,
  StateWithSubscriptionBaseDetail,
} from '../subscription-base-detail.state';
import { SubscriptionBaseDetail } from '../../../../model';

export const getSubscriptionBaseDetailFeatureState: MemoizedSelector<
  StateWithSubscriptionBaseDetail,
  SubscriptionBaseDetailState
> = createFeatureSelector<SubscriptionBaseDetailState>(
  SUBSCRIPTION_BASE_DETAIL_FEATURE
);

export const getAllSubscriptionBaseDetails: MemoizedSelector<
  StateWithSubscriptionBaseDetail,
  SubscriptionBaseDetailMap[]
> = createSelector(
  getSubscriptionBaseDetailFeatureState,
  (state: SubscriptionBaseDetailState) => state.subscriptionBaseDetailMap
);

export const getSubscriptionBaseDetail: MemoizedSelectorWithProps<
  StateWithSubscriptionBaseDetail,
  any,
  SubscriptionBaseDetail
> = createSelector(
  getAllSubscriptionBaseDetails,
  (state: SubscriptionBaseDetailMap[], props: any) => {
    const subscriptionBasedetail: SubscriptionBaseDetailMap = state
      ? state.find(
          (subscriptionBaseDetail: SubscriptionBaseDetailMap) =>
            subscriptionBaseDetail.subscriptionBaseId ===
              props.subscriptionBaseId &&
            subscriptionBaseDetail.baseSiteId === props.baseSiteId
        )
      : undefined;
    return subscriptionBasedetail
      ? subscriptionBasedetail.subscriptionBaseDetail
      : undefined;
  }
);
