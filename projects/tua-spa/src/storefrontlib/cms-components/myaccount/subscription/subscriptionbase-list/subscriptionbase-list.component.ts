import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  SubscriptionBase,
  SubscriptionBaseDetail,
  SubscriptionBaseRef,
  SubscriptionBaseDetailsService,
  SubscriptionBaseService
} from '../../../../../core';
@Component({
  selector: 'cx-subscription-history',
  templateUrl: './subscriptionbase-list.component.html',
  styleUrls: ['./subscriptionbase-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SubscriptionBaseListComponent implements OnInit, OnDestroy {
  subscriptions$: Observable<SubscriptionBase[]>;

  constructor(
    protected subscriptionService: SubscriptionBaseService,
    protected subscriptionDetailService: SubscriptionBaseDetailsService
  ) {}

  ngOnInit(): void {
    this.subscriptions$ = this.subscriptionService.getListOfSubscriptionBases();
  }

  ngOnDestroy(): void {
    this.subscriptionService.clearSubscriptionBaseList();
    this.subscriptionDetailService.clearSubscriptionBaseDetails();
  }

  getSubscriptionDetails(
    subscriberId: string
  ): Observable<SubscriptionBaseDetail> {
    return this.subscriptionDetailService.getSubscriptionBaseDetails(
      subscriberId
    );
  }

  getSubscriptionLength(subscription: SubscriptionBaseRef): number {
    if (!!subscription.product) {
      return subscription.product.length;
    }
    return 0;
  }
}
