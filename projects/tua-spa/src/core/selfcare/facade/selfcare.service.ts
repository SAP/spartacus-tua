import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseSiteService } from '@spartacus/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import {
  TmaBillingAccounts,
  TmaBillingAgreements,
  TmaSubscribedProductsInventory,
  TmaSubscriptions
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
   *         The selfcare subscriptions details as {@link Observable} of {@link TmaSubscriptions}
   */
  getSubscriptions(): Observable<TmaSubscribedProductsInventory> {
    return this.store.pipe(
      select(SelfcareSelectors.getSubscriptions),
      tap((subscriptions: TmaSubscribedProductsInventory) => {
        if (
          subscriptions === undefined ||
          Object.keys(subscriptions).length === 0
        ) {
          this.store.dispatch(new SelfcareActions.LoadSubscriptions());
        }
      })
    );
  }

  /**
   * Get Subscribed Product from Inventory
   * @param productId
   * @returns Subscribed Product
   */
  getSubscribedProduct(productId: string): Observable<TmaSubscriptions> {
    return this.store.pipe(
      select(SelfcareSelectors.getSubscribedProduct, {
        productId: productId
      })
    );
  }

  /**
   * Clears the state of selfcare subscriptions.
   */
  clearSubscriptionsState(): void {
    this.store.dispatch(new SelfcareActions.ClearSubscriptionsState());
  }

  /***
   * Retrieves Selfcare Billing Accounts from Inventory
   */
  getBillingAccounts(): Observable<TmaBillingAccounts[]> {
    return this.store.pipe(
      select(SelfcareSelectors.getBillingAccounts),
      tap((billingAccounts: TmaBillingAccounts[]) => {
        if (
          billingAccounts === undefined ||
          Object.keys(billingAccounts).length === 0
        ) {
          this.store.dispatch(new SelfcareActions.LoadBillingAccounts());
        }
      })
    );
  }

  /**
   * Get billing account details for specific billing account id
   * @param accountId Account Id
   * @returns Billing Account Details
   */
  getBillingAccountDetails(
    accountId: string
  ): Observable<TmaBillingAccounts> {
    return this.store.pipe(
      select(SelfcareSelectors.getBillingAccountDetails, {
        accountId: accountId
      })
    );
  }

  /***
   * Retrieves Selfcare Billing Agreements from Inventory
   */
   getBillingAgreements(): Observable<TmaBillingAgreements[]> {
    return this.store.pipe(
      select(SelfcareSelectors.getBillingAgreements),
      tap((billingAgreements: TmaBillingAgreements[]) => {
        if (
          billingAgreements === undefined ||
          Object.keys(billingAgreements).length === 0
        ) {
          this.store.dispatch(new SelfcareActions.LoadBillingAgreements());
        }
      })
    );
  }

  /**
   * Get billing agreement details for specific billing agreement id
   * @param agreementId Agreement Id
   * @returns Billing Agreement Details
   */
    getBillingAgreementDetails(
    agreementId: string
  ): Observable<TmaBillingAgreements> {
    return this.store.pipe(
      select(SelfcareSelectors.getBillingAgreementDetails, {
        agreementId: agreementId
      })
    );
  }

}
