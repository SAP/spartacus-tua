import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../../config/utils/tma-serialization-utils';
import { Action } from '@ngrx/store';
import { SubscriptionBaseDetailActionType } from '../actions/subscription-base-detail.action';
import * as SubscriptionBaseDetailActions from '../actions/subscription-base-detail.action';
import { SubscriptionBaseDetailConnector } from '../../connectors';
import { SubscriptionBaseDetail } from '../../../../model';

@Injectable()
export class SubscriptionBaseDetailEffect {
  constructor(
    protected actions$: Actions,
    protected tmaSubscriptionBaseDetailConnector: SubscriptionBaseDetailConnector
  ) {}

  @Effect()
  loadSubscriptionDetails$: Observable<Action> = this.actions$.pipe(
    ofType(SubscriptionBaseDetailActionType.LOAD_SUBSCRIPTION_BASE_DETAIL),
    map(
      (action: SubscriptionBaseDetailActions.LoadSubscriptionBaseDetail) =>
        action.payload
    ),
    mergeMap((payload) => {
      return this.tmaSubscriptionBaseDetailConnector
        .getSubscriptionDetails(payload.baseSiteId, payload.subscriptionBaseId)
        .pipe(
          map((subscriptionDetails: SubscriptionBaseDetail[]) => {
            return new SubscriptionBaseDetailActions.LoadSubscriptionBaseDetailSuccess(
              {
                subscriptionBaseDetail: subscriptionDetails,
                subscriptionBaseId: payload.subscriptionBaseId,
                baseSiteId: payload.baseSiteId,
              }
            );
          }),
          catchError((error: any) =>
            of(
              new SubscriptionBaseDetailActions.LoadSubscriptionBaseDetailFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );
}
