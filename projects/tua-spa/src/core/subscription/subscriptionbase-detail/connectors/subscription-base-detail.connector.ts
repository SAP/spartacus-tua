import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionBaseDetailAdapter } from '../store/adapters';
import { SubscriptionBaseDetail } from '../../../model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionBaseDetailConnector {
  constructor(protected adapter: SubscriptionBaseDetailAdapter) {
  }

  public getSubscriptionDetails(
    baseSiteId: string,
    subscriptionBaseId: string,
  ): Observable<SubscriptionBaseDetail[]> {
    return this.adapter.getSubscriptionDetails(baseSiteId, subscriptionBaseId);
  }
}
