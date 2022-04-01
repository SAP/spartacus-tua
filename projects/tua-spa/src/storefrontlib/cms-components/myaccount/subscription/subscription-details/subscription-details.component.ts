import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  User,
  UserOrderService,
  BaseSiteService,
  ProductSearchPage,
  ProductSearchService,
  RoutingService,
  ProductService
} from '@spartacus/core';
import { first, takeUntil, tap, take, filter, distinctUntilChanged, map } from 'rxjs/operators';
import {
  TmaTmfRelatedParty,
  TmfProductRelatedPartyRole,
  TmaOrder,
  TmfProductService,
  TmfProductMap,
  RecommendationService,
  TmfProduct,
  TmfProductStatus,
  TmaProcessTypeEnum,
  SubscriptionDetailDataService,
  TmaSelectionAction,
  TmaProduct,
  TmaGuidedSellingCurrentSelectionsService,
  LOCAL_STORAGE,
  TmfProductOfferingType,
  TmaChecklistActionService,
  TmaChecklistAction
} from '../../../../../core';
import { UserAccountFacade } from '@spartacus/user/account/root';

const { QUERY, FREE_TEXT, CODE } = LOCAL_STORAGE.SEARCH;
@Component({
  selector: 'cx-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionDetailsComponent implements OnInit, OnDestroy, AfterViewChecked {
  subscriptionId: string;
  subscriptionDetail$: Observable<TmfProductMap>;
  subscriptionDetail:TmfProductMap;
  user: User;
  baseSiteId: string;
  isEligibleForTermination$: Observable<boolean>;
  tmfProduct: TmfProduct;
  protected destroyed$ = new Subject();

  constructor(
    public recommendationService: RecommendationService,
    protected tmfProductService: TmfProductService,
    protected userAccountFacade: UserAccountFacade,
    protected userOrderService: UserOrderService,
    protected baseSiteService: BaseSiteService,
    protected subscriptionDetailDataService: SubscriptionDetailDataService,
    protected productSearchService: ProductSearchService,
    protected routingService: RoutingService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected productService: ProductService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected tmaChecklistActionService: TmaChecklistActionService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.subscriptionDetailDataService.getSubscriptionDetail
      .pipe(takeUntil(this.destroyed$))
      .subscribe();

    this.userAccountFacade
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

    this.subscriptionDetailDataService.updateSubscriptionDetail({}, true);

  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
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
   * Updates the subscription details in the subscription detail data service
   *
   * @param subscriptionDetail - The subscription details
   */
  updateSubscriptionDetail(subscriptionDetail: TmfProductMap): void {
    this.subscriptionDetailDataService.updateSubscriptionDetail(subscriptionDetail, true);
    this.prepareCgs(subscriptionDetail.tmfProduct.productOffering.id, subscriptionDetail.tmfProducts, 0);
  }

  /**
   * Prepares CGS page with necessary information and redirects to CGS page when information is loaded.
   *
   * @param tmfProducts - The tmf products
   * @param index - The index of the tmf product currently being processed
   */
   prepareCgs(
    bpoCode: string,
    tmfProducts: TmfProduct[],
    index: number
  ): void {

    if (!tmfProducts || tmfProducts.length <= index) {
      this.redirectToCgsPage(bpoCode);
      return;
    }

    if (tmfProducts[index].productOffering['@referredType'] === TmfProductOfferingType.OPERATIONAL_PRODUCT_OFFERING) {
      this.prepareCgs(bpoCode, tmfProducts, index + 1);
      return;
    }

    this.productSearchService.search(
      QUERY + FREE_TEXT + CODE + tmfProducts[index].productOffering.id,
      { pageSize: 1 }
    );
    this.productSearchService
      .getResults()
      .pipe(
        first((productSearchPage: ProductSearchPage) => {
          return (
            productSearchPage &&
            productSearchPage.products &&
            productSearchPage.products.length !== 0 &&
            !!productSearchPage.products.find(
              (product: TmaProduct) =>
                product.code === tmfProducts[index].productOffering.id
            )
          );
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((productSearchPage: ProductSearchPage) => {
        this.guidedSellingCurrentSelectionsService.changeSelection(
          productSearchPage.products.find(
            (product: TmaProduct) => product.code === tmfProducts[index].productOffering.id
          ),
          TmaSelectionAction.ADD
        );
        this.prepareCgs(bpoCode, tmfProducts, index + 1);
      });
  }

  /**
   * Gets the process type
   *
   * @return A {@link TmaProcessTypeEnum}
   */
  get processType(): typeof TmaProcessTypeEnum {
    return TmaProcessTypeEnum;
  }

  /**
   * Checks the subscription detail has an active subscribed product.
   *
   * @return true if subscription base has an active subscribed product as {@link boolean}
   */
   hasActiveSubcribedProduct(subscriptionDetail: TmfProductMap): boolean {
    let count = 0;
    count = this.hasUnavailableSubscribedProduct(subscriptionDetail.tmfProducts, 0, count) + 1;

    const subscribedProducts = subscriptionDetail.tmfProducts.find(
      (subscribedProduct: TmfProduct) =>
        subscribedProduct.status === TmfProductStatus.active
    );
    return subscribedProducts && subscriptionDetail.tmfProducts.length === count;
    }

  protected hasUnavailableSubscribedProduct(tmfProducts: TmfProduct[], index: number, count: number): number {

    if (index < tmfProducts.length) {
      this.tmaChecklistActionService
        .getChecklistActionForProductCode(this.baseSiteId, tmfProducts[index].productOffering.id)
        .pipe(
          take(2),
          filter((checklistResult: TmaChecklistAction[]) => !!checklistResult),
          distinctUntilChanged(),
          takeUntil(this.destroyed$),
          map((checklistResult: TmaChecklistAction[]) => {
            if (checklistResult) {
              count = count + 1;
              this.hasUnavailableSubscribedProduct(tmfProducts, index + 1, count);
            }
          })
        )
        .subscribe();
    }
    return count;
  }

  protected redirectToCgsPage(bpoCode: string): void {
    this.routingService.go({ cxRoute: 'cgs', params: { code: bpoCode, process: TmaProcessTypeEnum.RETENTION } });
  }
}
