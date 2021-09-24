import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseSiteService } from '@spartacus/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import {
  TmaSelfcareBillingAccounts,
  TmaSelfcareSubscriptions,
  TmaSubscribedProductsInventory
} from '../../model';
import { SelfcareActions } from '../store';
import * as SelfcareSelectors from '../store/selectors/selfcare.selector';
import { StateWithSelfcare } from '../store/selfcare-state';

@Injectable({
  providedIn: 'root'
})
export class SelfcareService implements OnDestroy {
  protected baseSiteId: string;
  protected destroyed$ = new Subject();

  constructor(
    protected store: Store<StateWithSelfcare>,
    protected baseSiteService: BaseSiteService
  ) {
    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Retrieves the details for the given selfcare subscriptions with context as specified.
   *
   * @return
   *         The selfcare subscriptions details as {@link Observable} of {@link TmaSelfcareSubscriptions}
   */
  getSelfcareSubscriptions(): Observable<TmaSubscribedProductsInventory> {
    return this.store.pipe(
      select(SelfcareSelectors.getSelfcareSubscriptions),
      tap((selfcareSubscriptions: TmaSubscribedProductsInventory) => {
        if (
          selfcareSubscriptions === undefined ||
          Object.keys(selfcareSubscriptions).length === 0
        ) {
          this.store.dispatch(new SelfcareActions.LoadSelfcareSubscriptions());
        }
      })
    );
  }

  /**
   * Get Subscribed Product from Inventory
   * @param productId
   * @returns Subscribed Product
   */
  getSubscribedProduct(
    productId: string
  ): Observable<TmaSelfcareSubscriptions> {
    return this.store.pipe(
      select(SelfcareSelectors.getSubscribedProduct, {
        productId: productId
      })
    );
  }

  /**
   * Clears the state of selfcare subscriptions.
   */
  clearSelfcareSubscriptionsState(): void {
    this.store.dispatch(new SelfcareActions.ClearSelfcareSubscriptionsState());
  }

  /***
   * Retrieves Selfcare Billing Accounts from Inventory
   */
  getSelfcareBillingAccounts(): Observable<TmaSelfcareBillingAccounts[]> {
    return this.store.pipe(
      select(SelfcareSelectors.getSelfcareBillingAccounts),
      tap((billingAccounts: TmaSelfcareBillingAccounts[]) => {
        if (
          billingAccounts === undefined ||
          Object.keys(billingAccounts).length === 0
        ) {
          this.store.dispatch(
            new SelfcareActions.LoadSelfcareBillingAccounts()
          );
        }
      })
    );
  }
}
