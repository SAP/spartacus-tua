import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TmaSelfcareBillingAccounts,
  TmaSelfcareSubscriptions,
  TmaSubscribedProductsInventory
} from '../../model';
import { SelfcareAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root'
})
export class SelfcareConnector {
  constructor(protected adapter: SelfcareAdapter) {}

  /**
   * Retrieves the details for the given selfcare subscriptions with context as specified.
   * @return
   * The selfcare subscriptions details as {@link Observable} of {@link TmaSelfcareSubscriptions}
   */
  public getSelfcareSubscriptions(): Observable<TmaSubscribedProductsInventory> {
    return this.adapter.getSelfcareSubscriptions();
  }

  /**
   * Retrieves the Subscribed product from inventory
   * @param productId
   * @returns subscribed product
   */
  public getSubscribedProduct(
    productId: string
  ): Observable<TmaSelfcareSubscriptions> {
    return this.adapter.getSubscribedProduct(productId);
  }

  /**
   * Retrieves billing accounts from inventory
   * @returns billing accounts
   */
  public getSelfcareBillingAccounts(): Observable<TmaSelfcareBillingAccounts[]> {
    return this.adapter.getSelfcareBillingAccounts();
  }
}
