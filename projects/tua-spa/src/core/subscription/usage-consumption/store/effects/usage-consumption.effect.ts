import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../../config/utils/tma-serialization-utils';
import { Action } from '@ngrx/store';
import { UsageConsumptionActionType } from '../actions/usage-consumption.action';
import * as UsageConsumptionActions from '../actions/usage-consumption.action';
import { UsageConsumptionConnector } from '../../connectors';
import { UsageConsumptionReport } from '../../../../model';

@Injectable()
export class UsageConsumptionEffect {
  constructor(
    protected actions$: Actions,
    protected tmaUsageConsumptionConnector: UsageConsumptionConnector
  ) {}

  @Effect()
  loadUsageConsumption$: Observable<Action> = this.actions$.pipe(
    ofType(UsageConsumptionActionType.LOAD_USAGE_CONSUMPTION),
    map(
      (action: UsageConsumptionActions.LoadUsageConsumption) => action.payload
    ),
    mergeMap((payload) => {
      return this.tmaUsageConsumptionConnector
        .getUsageConsumption(payload.baseSiteId, payload.subscriptionId)
        .pipe(
          map((usageConsumption: UsageConsumptionReport[]) => {
            return new UsageConsumptionActions.LoadUsageConsumptionSuccess({
              subscriptionId: payload.subscriptionId,
              baseSiteId: payload.baseSiteId,
              usageConsumption: usageConsumption,
            });
          }),
          catchError((error: any) =>
            of(
              new UsageConsumptionActions.LoadUsageConsumptionFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );
}
