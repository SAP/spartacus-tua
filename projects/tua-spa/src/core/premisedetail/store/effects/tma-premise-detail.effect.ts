import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaTechnicalResource } from '../../../model';
import { TmaPremiseDetailConnector } from '../../connectors';
import * as TmaPremiseDetailAction from '../actions/tma-premise-details.actions';
import { TmaPremiseDetailActionTypes } from '../actions/tma-premise-details.actions';

@Injectable()
export class TmaPremiseDetailEffect {

  constructor(
    protected actions$: Actions,
    protected tmaPremiseDetailConnector: TmaPremiseDetailConnector
  ) {
  }

  /**
   * Effect for the premise details related actions
   */
  @Effect()
  validatePremiseDetail$: Observable<Action> = this.actions$.pipe(
    ofType(TmaPremiseDetailActionTypes.VALIDATE_PREMISE_DETAIL),
    map((action: TmaPremiseDetailAction.ValidatePremiseDetail) => action.payload),
    mergeMap(payload => {
        return this.tmaPremiseDetailConnector.validatePremiseDetails(payload.premiseDetail).pipe(
          map((technicalResources: TmaTechnicalResource[]) => {
            return new TmaPremiseDetailAction.ValidatePremiseDetailSuccess({
              premiseDetail: payload.premiseDetail,
              technicalResources: technicalResources
            });
          }),
          catchError(error =>
            of(
              new TmaPremiseDetailAction.ValidatePremiseDetailFail({
                premiseDetail: payload.premiseDetail,
                error: makeErrorSerializable(error)
              })
            ))
        );
      }
    )
  );
}
