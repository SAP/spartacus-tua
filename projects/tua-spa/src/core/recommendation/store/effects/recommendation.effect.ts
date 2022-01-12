import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, concatMap } from 'rxjs/operators';
import { RecommendationConnector } from '../../connectors';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { RecommendationActionTypes } from '../actions/recommendation.action';
import { Recommendation } from '../../../model';
import { RecommendationAction } from '../actions';

@Injectable()
export class RecommendationEffect {
  constructor(
    protected actions$: Actions,
    protected recommendationConnector: RecommendationConnector
  ) {}

  @Effect()
  getRecommendations$: Observable<
    | RecommendationAction.LoadRecommendationSuccess
    | RecommendationAction.LoadRecommendationFail
  > = this.actions$.pipe(
    ofType(RecommendationActionTypes.LOAD_RECOMMENDATION),
    map((action: RecommendationAction.LoadRecommendation) => action.payload),
    concatMap((payload: any) => {
      return this.recommendationConnector
        .getRecommendations(
          payload.baseSiteId,
          payload.relatedPartyId,
          payload.processTypeId,
          payload.relatedProductOfferingId,
          payload.subscriptionBaseId
        )
        .pipe(
          map(
            (recommendations: Recommendation[]) =>
              new RecommendationAction.LoadRecommendationSuccess({
                processTypeId: payload.processTypeId,
                subscriptionBaseId: payload.subscriptionBaseId,
                recommendations: recommendations
              })
          ),
          catchError((error: any) => {
            return of(
              new RecommendationAction.LoadRecommendationFail({
                processTypeId: payload.processTypeId,
                subscriptionBaseId: payload.subscriptionBaseId,
                error: makeErrorSerializable(error)
              })
            );
          })
        );
    })
  );
}
