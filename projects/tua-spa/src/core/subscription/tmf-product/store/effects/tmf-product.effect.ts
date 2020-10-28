import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../../config/utils/tma-serialization-utils';
import { Action } from '@ngrx/store';
import { TmfProductActionType } from '../actions/tmf-product.action';
import * as TmfProductActions from '../actions/tmf-product.action';
import { TmfProductConnector } from '../../connectors';
import { TmfProduct } from '../../../../model';

@Injectable()
export class TmfProductEffect {
  constructor(
    protected actions$: Actions,
    protected tmfProductConnector: TmfProductConnector
  ) {}
  @Effect()
  loadSubscribedProduct$: Observable<Action> = this.actions$.pipe(
    ofType(TmfProductActionType.LOAD_TMF_PRODUCT),
    map((action: TmfProductActions.LoadTmfProduct) => action.payload),
    mergeMap((payload) => {
      return this.tmfProductConnector
        .getTmfProductDetails(payload.baseSiteId, payload.tmfProductId)
        .pipe(
          map((tmfProduct: TmfProduct[]) => {
            return new TmfProductActions.LoadTmfProductSuccess({
              tmfProduct: tmfProduct,
              tmfProductId: payload.tmfProductId,
              baseSiteId: payload.baseSiteId,
            });
          }),
          catchError((error: any) =>
            of(
              new TmfProductActions.LoadTmfProductFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );
}
