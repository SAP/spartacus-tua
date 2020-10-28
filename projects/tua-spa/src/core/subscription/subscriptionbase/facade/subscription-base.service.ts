import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as SubscriptionBaseSelectors from '../store';
import { takeUntil, tap } from 'rxjs/operators';
import { StateWithSubscriptionBase } from '../store';
import { BaseSiteService, UserService, User } from '@spartacus/core';
import { SubscriptionBase } from '../../../model';
import * as SubscriptionBaseActions from '../store/actions/subscription-base.action';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionBaseService implements OnDestroy {
  protected baseSiteId: string;
  protected user: User;
  protected destroyed$ = new Subject();

  constructor(
    protected store: Store<StateWithSubscriptionBase>,
    protected userService: UserService,
    protected baseSiteService: BaseSiteService
  ) {
    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
    this.userService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((customer: User) => (this.user = customer));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns a list of subscription bases.
   *
   * @return List of {@link SubscriptionBase} as an {@link Observable}
   */
  getListOfSubscriptionBases(): Observable<SubscriptionBase[]> {
    return this.store.pipe(
      select(SubscriptionBaseSelectors.getSubscriptionBaseForUserId, {
        baseSiteId: this.baseSiteId,
        userId: this.user.uid,
      }),
      tap((subscriptionBases: SubscriptionBase[]) => {
        if (subscriptionBases.length === 0) {
          this.loadSubscriptions(this.baseSiteId, this.user.uid);
        }
      })
    );
  }

  /**
   * Loads the user's subscriptions.
   *
   * @param baseSiteId The identifier of the base site
   * @param userId The identifier of the user
   */
  loadSubscriptions(baseSiteId: string, userId: string): void {
    this.store.dispatch(
      new SubscriptionBaseActions.LoadSubscriptionBase({
        baseSiteId,
        userId,
      })
    );
  }

  /**
   * Clears the subscription base list.
   */
  clearSubscriptionBaseList(): void {
    this.store.dispatch(new SubscriptionBaseActions.ClearAllSubscriptionBase());
  }
}
