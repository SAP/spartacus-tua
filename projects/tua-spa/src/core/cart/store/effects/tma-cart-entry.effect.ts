import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CartActions, CartModification, SiteContextActions, withdrawOn } from '@spartacus/core';
import { from, Observable } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaCartEntryConnector } from '../../connectors';
import * as TmaCartEntryActions from '../actions/tma-cart-entry.actions';
import { TmaCartEntryActionTypes } from '../actions/tma-cart-entry.actions';

@Injectable()
export class TmaCartEntryEffects {

  constructor(
    private tmaActions$: Actions,
    private tmaCartEntryConnector: TmaCartEntryConnector
  ) {
  }

  private tmaContextChange$ = this.tmaActions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  @Effect()
  addCartEntry$: Observable<
    | CartActions.CartAddEntrySuccess
    | CartActions.CartAddEntryFail
    | CartActions.LoadCart
    > = this.tmaActions$.pipe(
    ofType(TmaCartEntryActionTypes.ADD_ENTRY),
    map((action: TmaCartEntryActions.AddEntry) => action.payload),
    concatMap(payload => {
      return this.tmaCartEntryConnector
        .addCartEntry(
          payload.userId,
          payload.cartId,
          payload.cartEntry
        )
        .pipe(
          map(
            (cartModification: CartModification) =>
              new CartActions.CartAddEntrySuccess({
                ...payload,
                ...(cartModification as Required<CartModification>)
              })
          ),
          catchError((error) =>
            from([
              new CartActions.CartAddEntryFail({
                ...payload,
                error: makeErrorSerializable(error)
              }),
              new CartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId
              })
            ])
          )
        );
    }),
    withdrawOn(this.tmaContextChange$)
  );

  @Effect()
  updateCartEntry$: Observable<
    | CartActions.CartUpdateEntrySuccess
    | CartActions.CartUpdateEntryFail
    | CartActions.LoadCart
    > = this.tmaActions$.pipe(
    ofType(TmaCartEntryActionTypes.UPDATE_ENTRY),
    map((action: TmaCartEntryActions.UpdateEntry) => action.payload),
    concatMap(payload =>
      this.tmaCartEntryConnector
        .updateCartEntry(payload.userId, payload.cartId, payload.cartEntry)
        .pipe(
          map(() => {
            return new CartActions.CartUpdateEntrySuccess({
              ...payload
            });
          }),
          catchError((error) =>
            from([
              new CartActions.CartUpdateEntryFail({
                ...payload,
                error: makeErrorSerializable(error)
              }),
              new CartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId
              })
            ])
          )
        )
    ),
    withdrawOn(this.tmaContextChange$)
  );
}
