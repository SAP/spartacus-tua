import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  SubscriptionTermState,
  SUBSCRIPTION_TERM_FEATURE
} from '../subscription-term.state';

export const subscriptionTermState = createFeatureSelector<SubscriptionTermState>(
  SUBSCRIPTION_TERM_FEATURE
);

export const getSelectedSubscriptionTerm = createSelector(
  subscriptionTermState,
  (state) => state.selectedSubscriptionTerm
);

export const getSelectedSubscriptionTermId = createSelector(
  subscriptionTermState,
  (state) =>
    state.selectedSubscriptionTerm
      ? state.selectedSubscriptionTerm.id
      : undefined
);
