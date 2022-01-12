import {
  createFeatureSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
  createSelector
} from '@ngrx/store';
import {
  RECOMMENDATION_FEATURE,
  StateWithRecommendation,
  RecommendationState,
  RecommendationMap
} from '../recommendation.state';

export const getRecommendationFeatureState: MemoizedSelector<
  StateWithRecommendation,
  RecommendationState
> = createFeatureSelector<RecommendationState>(RECOMMENDATION_FEATURE);

export const getRecommendationDetails: MemoizedSelector<
  StateWithRecommendation,
  RecommendationMap[]
> = createSelector(
  getRecommendationFeatureState,
  (state: RecommendationState) => {
    return state.recommendationMap;
  }
);

export const checkRecommendationsFor: MemoizedSelectorWithProps<
  StateWithRecommendation,
  any,
  boolean
> = createSelector(
  getRecommendationDetails,
  (state: RecommendationMap[], props) => {
    const recommendation = state
      ? state.find(
          (recommendationMap: RecommendationMap) =>
            recommendationMap.subscriptionBaseId === props.subscriptionBaseId &&
            recommendationMap.processTypeId === props.processTypeId
        )
      : undefined;
    if (!!recommendation) {
      return recommendation.isSubscriptionEligibleForProcessType;
    }
  }
);
