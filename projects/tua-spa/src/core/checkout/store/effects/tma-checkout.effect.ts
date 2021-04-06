import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  CheckoutActions,
  CheckoutDeliveryConnector,
  SiteContextActions,
  withdrawOn
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaCheckoutAction } from '../actions';

@Injectable()
export class TmaCheckoutEffects {
  private contextChange$ = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  @Effect()
  setDeliveryAddressToCart$: Observable<
    | TmaCheckoutAction.SetDeliveryAddressToCart
    | CheckoutActions.SetDeliveryAddressSuccess
    | CheckoutActions.SetDeliveryAddressFail
  > = this.actions$.pipe(
    ofType(TmaCheckoutAction.SET_DELIVERY_ADDRESS_CART),
    map((action: any) => action.payload),
    mergeMap((payload) => {
      return this.checkoutDeliveryConnector
        .setAddress(payload.userId, payload.cartId, payload.address.id)
        .pipe(
          mergeMap(() => [
            new CheckoutActions.SetDeliveryAddressSuccess(payload.address)
          ]),
          catchError((error) =>
            of(
              new CheckoutActions.SetDeliveryAddressFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    }),
    withdrawOn(this.contextChange$)
  );

  constructor(
    private actions$: Actions,
    private checkoutDeliveryConnector: CheckoutDeliveryConnector
  ) {}
}
