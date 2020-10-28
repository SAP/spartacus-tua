import { Observable } from 'rxjs';
import { SubscriptionBaseDetail } from '../../../../model';

export abstract class SubscriptionBaseDetailAdapter {
  /**
   * Abstract method used to get the subscription base details
   * @param baseSiteId The identifier of the base site
   * @param subscriptionBaseId The identifier of the subscription base
   * @returns Observable of SubscriptionBaseDetail
   */
  abstract getSubscriptionDetails(
    baseSiteId: string,
    subscriptionBaseId: string
  ): Observable<SubscriptionBaseDetail[]>;
}
