import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseSiteService, OccConfig, User, UserService } from '@spartacus/core';
import {
  CmsComponentData,
  MediaService,
  ModalService
} from '@spartacus/storefront';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ProductOfferingService,
  RecommendationService,
  TmaPriceService,
  TmaProcessTypeEnum,
  TmfProduct,
  TmfProductMap,
  TmfProductService,
  SubscriptionTermService
} from '../../../../../core';
import {
  TmaCmsBannerRenewalComponent,
  TmaPriceContext,
  TmaProductOfferingPrice,
  TmaSubscriptionTerm,
  TmfProductOfferingType,
  TmfProductStatus
} from '../../../../../core/model';

@Component({
  templateUrl: './renew-subscription-banner.component.html',
  styleUrls: ['./renew-subscription-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenewSubscriptionBannerComponent
  implements OnInit, OnDestroy, AfterViewInit {
  modalRef: any;
  baseUrl: string;
  baseSiteId: string;
  user: User;
  subscriptionId: string;
  subscriptionDetail$: Observable<TmfProductMap>;
  validSubscribedProducts: TmfProduct[] = [];
  defaultSubscriptionTermId: string;
  highestPriorityProductOfferingPrice: TmaProductOfferingPrice;
  list: TmaProductOfferingPrice[] = [];
  protected destroyed$ = new Subject();

  constructor(
    public component: CmsComponentData<TmaCmsBannerRenewalComponent>,
    public mediaService: MediaService,
    public productOfferingService: ProductOfferingService,
    public priceService: TmaPriceService,
    public subscriptionTermService: SubscriptionTermService,
    protected config: OccConfig,
    protected modalService: ModalService,
    protected recommendationService: RecommendationService,
    protected tmfProductService: TmfProductService,
    protected baseSiteService: BaseSiteService,
    protected userService: UserService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
    this.userService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((customer: User) => (this.user = customer));
    this.subscriptionId = this.activatedRoute.snapshot.url[3].toString();
    this.subscriptionDetail$ = this.tmfProductService.getTmfProductMap(
      this.subscriptionId
    );
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tmfProductService.clearTmfProductDetails();
    this.productOfferingService.clearProductOfferingState();
    this.subscriptionTermService.clearSelectedSubscriptionTerm();
  }

  /**
   * Checks if subscription is eligible for renewal.
   *
   * @param subscriptionDetails Details of subscription base
   *
   * @return true if subscription is eligible for renewal as {@link boolean} as an {@link Observable}
   */
  isSubscriptionEligibleForRenewal(
    subscriptionDetails: TmfProductMap
  ): Observable<boolean> {
    const subscribedProducts: TmfProduct[] = subscriptionDetails.tmfProducts;
    this.validSubscribedProducts = subscribedProducts.filter(
      (subscribedProduct: TmfProduct) =>
        subscribedProduct.productOffering['@referredType'] !==
          TmfProductOfferingType.OPERATIONAL_PRODUCT_OFFERING &&
        subscribedProduct.status === TmfProductStatus.active
    );
    if (this.validSubscribedProducts.length > 0) {
      return this.recommendationService.checkRecommendationsFor(
        this.baseSiteId,
        this.user.uid,
        TmaProcessTypeEnum.RETENTION,
        this.validSubscribedProducts[0].productOffering.id,
        subscriptionDetails.tmfProduct.id
      );
    }
  }

  /**
   * This method sets the subscription term in state.Based on the provided selected term,
   * also sets the highest priority price.
   * 
   * @param eligibleTerms - Array of eligible subscription term 
   * @param prices - Array containing all prices for subscribed product
   * @param priceContext - Array of price context for the product offering.
   * @param selectedTermId - Selected subscription term id
   */
  setSubscriptionTermAndPrice(
    eligibleTerms: TmaSubscriptionTerm[],
    prices: TmaProductOfferingPrice[],
    priceContext: TmaPriceContext[],
    selectedTermId?: string
  ): void {
    const selectedTerm = eligibleTerms.find(
      (term: TmaSubscriptionTerm) => term.id === selectedTermId
    );
    this.subscriptionTermService.setSubscriptionTerm(selectedTerm);
    this.highestPriorityProductOfferingPrice = prices.find(
      (price: TmaProductOfferingPrice) =>
        price.id ===
        this.priceService.getHighestPriorityPriceContext(
          priceContext,
          selectedTerm.id
        ).productOfferingPrice.id
    );
  }

  /**
   * Sets the default subscription term.
   * 
   * @param id - Selected subscription term id
   */
  defaultSubscriptionTermSelected(id: string): void {
    this.defaultSubscriptionTermId = id;
    this.changeDetectorRef.detectChanges();
  }
}
