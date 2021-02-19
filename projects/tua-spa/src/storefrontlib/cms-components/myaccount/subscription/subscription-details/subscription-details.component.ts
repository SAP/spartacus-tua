import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService, User, UserOrderService } from '@spartacus/core';
import { takeUntil, tap } from 'rxjs/operators';
import {
  TmaTmfRelatedParty,
  TmfProductRelatedPartyRole,
  TmaOrder,
  TmfProductService,
  TmfProductMap
} from '../../../../../core';

@Component({
  selector: 'cx-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit, OnDestroy {
  subscriptionId: string;
  subscriptionDetail$: Observable<TmfProductMap>;
  user: User;
  protected destroyed$ = new Subject();

  constructor(
    protected tmfProductService: TmfProductService,
    protected userService: UserService,
    protected userOrderService: UserOrderService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((customer: User) => (this.user = customer));

    this.subscriptionId = this.activatedRoute.snapshot.url[3].toString();
    this.subscriptionDetail$ = this.tmfProductService.getTmfProductMap(
      this.subscriptionId
    );   
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tmfProductService.clearTmfProductDetails();
  }

  /**
   * Checks for the given list of related party has role of "Owner".
   *
   * @param relatedParty the list of relatedParty
   *
   * @return true if related party has role Owner as {@link boolean}.
   */
  hasRoleOwner(relatedParty: TmaTmfRelatedParty[]): boolean {
    let isOwner = false;
    relatedParty.forEach((customer: TmaTmfRelatedParty) => {
      if (customer.id === this.user.uid) {
        isOwner = customer.role === TmfProductRelatedPartyRole.OWNER;
      }
    });
    return isOwner;
  }

  /**
   * Retrives the order details for a given order id.
   *
   * @param orderId the orderId
   *
   * @return order as {@link TmaOrder} of {@link Observable}.
   */
  getProductOrder(orderId: string): Observable<TmaOrder> {
    if (!!orderId) {
      return this.userOrderService.getOrderDetails().pipe(
        tap((order: TmaOrder) => {
          if (Object.keys(order).length === 0 || order.code !== orderId) {
            this.userOrderService.loadOrderDetails(orderId);
          }
        })
      );
    }
  }
}
