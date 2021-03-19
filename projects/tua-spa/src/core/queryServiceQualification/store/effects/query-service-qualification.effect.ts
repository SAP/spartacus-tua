import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { QueryServiceQualificationTypes } from '../actions/query-service-qualification.actions';
import { QueryServiceQualificationConnector } from '../../connectors';
import { QueryServiceQualification } from '../../../model';
import { QueryServiceQualificationActions } from '../actions';
import { ProductSearchConnector } from '@spartacus/core';

@Injectable()
export class QueryServiceQualificationEffects {
  constructor(
    protected serviceQualificationConnector: QueryServiceQualificationConnector,
    protected queryServiceProductSearchConnector: ProductSearchConnector,
    private actions$: Actions
  ) {}

  @Effect()
  getQueryServiceQualification$: Observable<
    | QueryServiceQualificationActions.CreateQueryServiceQualification
    | QueryServiceQualificationActions.CreateQueryServiceQualificationSuccess
    | QueryServiceQualificationActions.CreateQueryServiceQualificationFail
  > = this.actions$.pipe(
    ofType(QueryServiceQualificationTypes.CREATE_QUERY_SERVICE_QUALIFICATION),
    map(
      (
        action: QueryServiceQualificationActions.CreateQueryServiceQualification
      ) => action.payload
    ),
    concatMap((payload: any) => {
      return this.serviceQualificationConnector
        .createQueryServiceQualification(payload)
        .pipe(
          map(
            (serviceQualification: QueryServiceQualification) =>
              new QueryServiceQualificationActions.CreateQueryServiceQualificationSuccess(
                serviceQualification
              )
          ),
          catchError((error: any) =>
            of(
              new QueryServiceQualificationActions.CreateQueryServiceQualificationFail(
                {
                  errorResponse: makeErrorSerializable(error)
                }
              )
            )
          )
        );
    })
  );

  @Effect()
  queryServiceSearchProducts$: Observable<
    | QueryServiceQualificationActions.QueryServiceProductSearchResult
    | QueryServiceQualificationActions.QueryServiceProductSearchResultSuccess
    | QueryServiceQualificationActions.QueryServiceProductSearchResultFail
  > = this.actions$.pipe(
    ofType(QueryServiceQualificationTypes.QUERY_SERVICE_PRODUCT_SEARCH_RESULT),
    map(
      (
        action: QueryServiceQualificationActions.QueryServiceProductSearchResult
      ) => action.payload
    ),
    concatMap(payload => {
      const queryResult = [];
      payload.queryText.forEach((query: string) => {
        queryResult.push(this.queryServiceProductSearchConnector.search(query));
      });
      return forkJoin(...queryResult).pipe(
        map(searchResult => {
          return new QueryServiceQualificationActions.QueryServiceProductSearchResultSuccess(
            searchResult
          );
        }),
        catchError(error =>
          of(
            new QueryServiceQualificationActions.QueryServiceProductSearchResultFail(
              makeErrorSerializable(error)
            )
          )
        )
      );
    })
  );
}
