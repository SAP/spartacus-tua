import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, concatMap } from 'rxjs/operators';
import { TmaProductOrderConnector } from '../../connectors';
import { TmaPaginatedProductOrder, TmaProductOrder } from '../../../model';
import { TmaProductOrderActionType } from '../actions/tma-product-order.action';
import { TmaProductOrderAction } from '../actions';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { AuthActions } from '@spartacus/core';
import { Action } from '@ngrx/store';

@Injectable()
export class TmaProductOrderEffects {

  constructor(
    protected actions$: Actions,
    protected productOrderConnector: TmaProductOrderConnector
  ) {
  }

  /**
   * Effect for {@link LoadProductOrders} actions
   */
  @Effect()
  getProductOrders$: Observable<TmaProductOrderAction.LoadProductOrdersSuccess | TmaProductOrderAction.LoadProductOrdersFail> =
    this.actions$.pipe(
      ofType(TmaProductOrderActionType.LOAD_PRODUCT_ORDERS),
      map((action: TmaProductOrderAction.LoadProductOrders) => action.payload),
      switchMap((payload: any) => {
        return this.productOrderConnector.getProductOrders(payload.userId, payload.baseSiteId, payload.searchConfig)
          .pipe(
            map((productOrders: TmaPaginatedProductOrder) =>
              new TmaProductOrderAction.LoadProductOrdersSuccess(productOrders)
            ),
            catchError((error: any) =>
              of(
                new TmaProductOrderAction.LoadProductOrdersFail({
                  errorResponse: makeErrorSerializable(error)
                })
              )
            )
          );
      })
    );

  /**
   * Effect for {@link ClearTmaProductOrderData} action on log out
   */
  @Effect()
  clearTmaProductOrderData$: Observable<TmaProductOrderAction.ClearTmaProductOrderData> =
    this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      map(() => new TmaProductOrderAction.ClearTmaProductOrderData())
    );

  /**
   * Effect for {@link UpdateOrder} actions
   */
  @Effect()
  updateOrder$: Observable<Action> = this.actions$.pipe(
    ofType(TmaProductOrderActionType.UPDATE_ORDER),
    map(
      (action: TmaProductOrderAction.UpdateOrder) =>
        action.payload
    ),
    concatMap((payload: any) => {
      return this.productOrderConnector
        .updateOrder(
          payload.baseSiteId,
          payload.orderId,
          payload.order
        )
        .pipe(
          map(
            (productOrder: TmaProductOrder) =>
              new TmaProductOrderAction.UpdateOrderSuccess({
                productOrder: productOrder
              })
          ),
          catchError((error: any) =>
            of(
              new TmaProductOrderAction.UpdateOrderFail({
                errorResponse: makeErrorSerializable(error)
              })
            )
          )
        );
    })
  );
}
