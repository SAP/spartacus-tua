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
  ProductRef,
} from '../../../../../core/model';
import { SubscriptionBaseDetailService } from '../../../../../core/subscription/subscriptionbase-detail/facade';
import { SubscriptionBaseService } from '../../../../../core/subscription/subscriptionbase/facade';

@Component({
  selector: 'cx-subscription-history',
  templateUrl: './subscriptionbase-list.component.html',
  styleUrls: ['./subscriptionbase-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SubscriptionBaseListComponent implements OnInit, OnDestroy {
  usageDetails: boolean;
  subscriptionHistory: boolean;
  subsId: string;
  subscribedProductMap = new Map<string, ProductRef[]>();
  subscriptions$: Observable<SubscriptionBase[]>;

  constructor(
    protected subscriptionService: SubscriptionBaseService,
    protected subscriptionDetailService: SubscriptionBaseDetailService
  ) {}

  ngOnInit(): void {
    this.usageDetails = true;
    this.subscriptionHistory = true;
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

  hideDiv(selectedDiv: string, id: string, product: ProductRef[]): void {
    if (selectedDiv === 'usage') {
      this.usageDetails = false;
      this.subsId = id;
      if (!!product) {
        this.subscribedProductMap.set(id, product);
      }
    }
    if (selectedDiv === 'subscription') {
      this.subscriptionHistory = false;
    }
  }

  goBack(target): void {
    if (target === 'usage') {
      this.usageDetails = true;
      this.subsId = null;
    }
    if (target === 'subscriptions') {
      this.subscriptionHistory = true;
    }
  }
}
