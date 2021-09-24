import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import {
  ProductRef,
  TmaSelfcareBillingAccounts,
  TmaSelfcareSubscriptions
} from '../../../model';
import { SelfcareConnector } from '../../connectors/selfcare.connector';
import { SelfcareActions } from '../actions';
import { SelfcareActionTypes } from '../actions/selfcare.actions';

@Injectable()
export class SelfcareEffect {
  constructor(
    protected actions$: Actions,
    protected selfcareConnector: SelfcareConnector
  ) {}

  @Effect()
  getSelfcareSubscriptions$: Observable<Action> = this.actions$.pipe(
    ofType(SelfcareActionTypes.LOAD_SELFCARE_SUBSCRIPTIONS),
    switchMap(() => this.selfcareConnector.getSelfcareSubscriptions()),
    switchMap((products: any) => {
      const result = [];
      if (products) {
        Object.values(products).forEach((item: TmaSelfcareSubscriptions) => {
          if (item.isBundle) {
            item.product.forEach((product: ProductRef) =>
              result.push(
                this.selfcareConnector.getSubscribedProduct(product.id)
              )
            );
          }
        });
      }
      return forkJoin(...result).pipe(
        map(
          (data) =>
            new SelfcareActions.LoadSelfcareSubscriptionsSuccess({
              selfcareSubscriptions: {
                subscribedProducts: Object.values(products),
                childrens: data
              }
            })
        )
      );
    })
  );

  @Effect()
  getSelfcareBillingAccounts$: Observable<Action> = this.actions$.pipe(
    ofType(SelfcareActionTypes.LOAD_SELFCARE_BILLING_ACCOUNTS),
    map((action: SelfcareActions.LoadSelfcareBillingAccounts) => {}),
    mergeMap(() => {
      return this.selfcareConnector.getSelfcareBillingAccounts().pipe(
        map(
          (billingAccounts: TmaSelfcareBillingAccounts[]) =>
            new SelfcareActions.LoadSelfcareBillingAccountsSuccess({
              billingAccounts: billingAccounts
            })
        ),
        catchError((error: any) =>
          of(
            new SelfcareActions.LoadSelfcareBillingAccountsFail({
              errorResponse: makeErrorSerializable(error)
            })
          )
        )
      );
    })
  );
}
