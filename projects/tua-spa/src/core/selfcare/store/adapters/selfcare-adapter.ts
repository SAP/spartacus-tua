import { Observable } from 'rxjs';
import {
  TmaSelfcareBillingAccounts,
  TmaSelfcareSubscriptions,
  TmaSubscribedProductsInventory
} from '../../../model';

export abstract class SelfcareAdapter {
  /**
   * Retrieves the details for the given selfcare subscriptions with context as specified.
   * @return
   *         The product offering details as {@link Observable} of {@link TmaSelfcareSubscriptions}
   */
  abstract getSelfcareSubscriptions(): Observable<TmaSubscribedProductsInventory>;

  /**
   * Get subscribed product from inventory
   * @param productId
   */
  abstract getSubscribedProduct(
    productId: string
  ): Observable<TmaSelfcareSubscriptions>;

  /**
   * Retrieves billing accounts from inventory.
   */
  abstract getSelfcareBillingAccounts(): Observable<TmaSelfcareBillingAccounts[]>;
}
