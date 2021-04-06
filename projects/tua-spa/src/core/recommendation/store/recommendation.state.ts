import { Recommendation } from '../../model';

export const RECOMMENDATION_FEATURE = 'Recommendation';

export interface StateWithRecommendation {
  [RECOMMENDATION_FEATURE]: RecommendationState;
}

export interface RecommendationMap {
  subscriptionBaseId: string;
  processTypeId: string;
  isSubscriptionEligibleForProcessType: boolean;
  error?: string;
  recommendation?: Recommendation[];
}

export interface RecommendationState {
  recommendationMap: RecommendationMap[];
}
