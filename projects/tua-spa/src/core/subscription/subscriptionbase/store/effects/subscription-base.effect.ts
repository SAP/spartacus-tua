import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../../config/utils/tma-serialization-utils';
import { Action } from '@ngrx/store';
import { SubscriptionBaseConnector } from '../../connectors';
import { SubscriptionBaseActionType } from '../actions/subscription-base.action';
import * as SubscriptionBaseActions from '../actions/subscription-base.action';
import { SubscriptionBase } from '../../../../model';

@Injectable()
export class SubscriptionBaseEffect {
  constructor(
    protected actions$: Actions,
    protected tmaSubscriptionBaseConnector: SubscriptionBaseConnector
  ) {}

  @Effect()
  loadSubscription$: Observable<Action> = this.actions$.pipe(
    ofType(SubscriptionBaseActionType.LOAD_SUBSCRIPTION_BASE),
    map(
      (action: SubscriptionBaseActions.LoadSubscriptionBase) => action.payload
    ),
    mergeMap((payload) => {
      return this.tmaSubscriptionBaseConnector
        .getListOfSubscriptionBase(payload.baseSiteId, payload.userId)
        .pipe(
          map((subscriptions: SubscriptionBase[]) => {
            return new SubscriptionBaseActions.LoadSubscriptionBaseSuccess({
              subscription: subscriptions,
              userId: payload.userId,
              baseSiteId: payload.baseSiteId,
            });
          }),
          catchError((error: any) =>
            of(
              new SubscriptionBaseActions.LoadSubscriptionBaseFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );
}
