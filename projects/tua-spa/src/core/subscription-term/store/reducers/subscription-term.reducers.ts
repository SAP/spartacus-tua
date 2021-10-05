import { createReducer, on, Action } from '@ngrx/store';
import { SubscriptionTermActions } from '../actions';
import { initialSubscriptionTermState } from '../subscription-term.state';

const subscriptionTermReducers = createReducer(
    initialSubscriptionTermState,
    on(SubscriptionTermActions.setSubscriptionTerm, (state, action) => {
        return { ...state, selectedSubscriptionTerm: action.subscriptionTerm }
    }),
    on(SubscriptionTermActions.clearSubscriptionTermState, (state) => {
        return { ...state, selectedSubscriptionTerm: undefined}
    }),
)

export function subscriptionTermReducer(state, action: Action) {
    return subscriptionTermReducers(state, action);
}
