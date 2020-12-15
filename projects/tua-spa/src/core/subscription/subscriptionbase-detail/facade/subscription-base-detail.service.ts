import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as SubscriptionBaseDetailSelectors from '../store/selectors/subscription-base-detail.selector';
import { takeUntil, tap } from 'rxjs/operators';
import { StateWithSubscriptionBaseDetail } from '../store';
import * as SubscriptionBaseDetailActions from '../store/actions/subscription-base-detail.action';
import { BaseSiteService } from '@spartacus/core';
import { SubscriptionBaseDetail } from '../../../model';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionBaseDetailService implements OnDestroy{
  protected baseSiteId: string;
  protected destroyed$ = new Subject();

  constructor(
    protected store: Store<StateWithSubscriptionBaseDetail>,
    protected baseSiteService: BaseSiteService
  ) {
    this.baseSiteService
      .getActive().pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns the details of SubscriptionBase like list of Products, relatedParty and other details.
   * @param subscriptionBaseId The identifier of the subscription base
   * @returns SubscriptionBase details {@link SubscriptionBaseDetail} as an {@link Observable}
   */

  getSubscriptionBaseDetails(
    subscriptionBaseId: string
  ): Observable<SubscriptionBaseDetail> {
    return this.store.pipe(
      select(SubscriptionBaseDetailSelectors.getSubscriptionBaseDetail, {
        baseSiteId: this.baseSiteId,
        subscriptionBaseId: subscriptionBaseId,
      }),
      tap((subscriptionBaseDetails: SubscriptionBaseDetail) => {
        if (subscriptionBaseDetails == null) {
          this.loadSubscriptionDetails(this.baseSiteId, subscriptionBaseId);
        }
      })
    );
  }

  /**
   * Loads the SubscriptionBase details.
   *
   * @param baseSiteId The identifier of the base site
   * @param subscriptionBaseId The identifier of the SubscriptionBase
   */
  loadSubscriptionDetails(
    baseSiteId: string,
    subscriptionBaseId: string
  ): void {
    this.store.dispatch(
      new SubscriptionBaseDetailActions.LoadSubscriptionBaseDetail({
        baseSiteId,
        subscriptionBaseId,
      })
    );
  }

  /**
   * Clears the SubscriptionBase details.
   */
  clearSubscriptionBaseDetails(): void {
    this.store.dispatch(
      new SubscriptionBaseDetailActions.ClearSubscriptionBaseDetails()
    );
  }
}
