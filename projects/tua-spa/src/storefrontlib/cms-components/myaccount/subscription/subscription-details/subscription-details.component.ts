import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  UserService,
  User,
  UserOrderService,
  BaseSiteService
} from '@spartacus/core';
import { takeUntil, tap } from 'rxjs/operators';
import {
  TmaTmfRelatedParty,
  TmfProductRelatedPartyRole,
  TmaOrder,
  TmfProductService,
  TmfProductMap,
  RecommendationService,
  TmfProduct,
  TmfProductStatus,
  TmaProcessTypeEnum
} from '../../../../../core';

@Component({
  selector: 'cx-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SubscriptionDetailsComponent implements OnInit, OnDestroy {
  subscriptionId: string;
  subscriptionDetail$: Observable<TmfProductMap>;
  user: User;
  baseSiteId: string;
  isEligibleForTermination$: Observable<boolean>;
  tmfProduct: TmfProduct;
  protected destroyed$ = new Subject();

  constructor(
    public recommendationService: RecommendationService,
    protected tmfProductService: TmfProductService,
    protected userService: UserService,
    protected userOrderService: UserOrderService,
    protected baseSiteService: BaseSiteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((customer: User) => (this.user = customer));

    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
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

  /**
   * Checks if subscribed product is eligible for given process type.
   *
   * @param product
   *         The subscribed product as {@link TmfProduct}
   * @param processTypeId
   *         The identifier of the processType as {@link string}
   * @param subscriptionId
   *         The identifier of the subscription as {@link string}   *
   */
  isSubscriptionEligibleFor(
    product: TmfProduct,
    processTypeId: string,
    subscriptionId: string
  ) {
    if (product.status === TmfProductStatus.active) {
      this.tmfProduct = product;
      this.isEligibleForTermination$ = this.recommendationService.checkRecommendationsFor(
        this.baseSiteId,
        this.user.uid,
        processTypeId,
        product.productOffering.id,
        subscriptionId
      );
    }
  }

  /**
   * Gets the process type
   *
   * @return A {@link TmaProcessTypeEnum}
   */
  get processType(): typeof TmaProcessTypeEnum {
    return TmaProcessTypeEnum;
  }
}
