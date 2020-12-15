import {
  SubscriptionBaseDetailAction,
  SubscriptionBaseDetailActionType,
} from '../actions/subscription-base-detail.action';
import { SubscriptionBaseDetailMap } from '../subscription-base-detail.state';

const initialState: SubscriptionBaseDetailMap[] = [];

/**
 * Function to handle the transitions of SubscriptionBaseDetailState
 * @param state The state of the SubscriptionBaseDetailState
 * @param action Dispatched action of {@link SubscriptionBaseDetailAction}
 * @returns list of {@link SubscriptionBaseDetailMap} of {@link SubscriptionBaseDetailState}
 */
export function subscriptionBaseDetailReducer(
  state = initialState,
  action: SubscriptionBaseDetailAction
): SubscriptionBaseDetailMap[] {
  switch (action.type) {
    case SubscriptionBaseDetailActionType.LOAD_SUBSCRIPTION_BASE_DETAIL_SUCCESS: {
      if (
        !state.find(
          (subscriptionBaseDetailState: SubscriptionBaseDetailMap) =>
            subscriptionBaseDetailState.subscriptionBaseId ===
              action.payload.subscriptionBaseId &&
            subscriptionBaseDetailState.baseSiteId === action.payload.baseSiteId
        )
      ) {
        state = state.concat({
          subscriptionBaseDetail: action.payload.subscriptionBaseDetail,
          subscriptionBaseId: action.payload.subscriptionBaseId,
          baseSiteId: action.payload.baseSiteId,
        });
      }
      return state;
    }
    case SubscriptionBaseDetailActionType.LOAD_SUBSCRIPTION_BASE_DETAIL_FAIL ||
      SubscriptionBaseDetailActionType.CLEAR_SUBSCRIPTION_BASE_DETAILS: {
      return initialState;
    }
  }
  return state;
}
