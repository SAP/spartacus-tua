import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';
import { SubscriptionBaseDetailState } from '../subscription-base-detail.state';
import { subscriptionBaseDetailReducer } from './subscription-base-detail.reducer';

export function getReducers(): ActionReducerMap<SubscriptionBaseDetailState> {
  return {
    subscriptionBaseDetailMap: subscriptionBaseDetailReducer
  };
}
export const reducerToken: InjectionToken<ActionReducerMap<SubscriptionBaseDetailState>> = new InjectionToken<ActionReducerMap<SubscriptionBaseDetailState>>('subscriptionBaseDetailReducer');
export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
export const metaReducers: MetaReducer<any>[] = [];
