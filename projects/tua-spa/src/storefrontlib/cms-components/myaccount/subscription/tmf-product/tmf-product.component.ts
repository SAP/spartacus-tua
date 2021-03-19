import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  TmfProductService,
  TmaProcessTypeEnum,
  RecommendationService
} from '../../../../../core';
import {
  TmfProduct,
  TmfProductRelatedPartyRole,
  TmfProductStatus,
  TmaOrderEntry,
  TmaCartItemPrice,
  TmaOrder,
  TmaTmfRelatedParty
} from '../../../../../core/model';
import {
  UserOrderService,
  CurrencyService,
  User,
  UserService,
  BaseSiteService
} from '@spartacus/core';
import { filter, takeUntil } from 'rxjs/operators';
import { TmaCartPriceService } from '../../../../../core/cart/facade';
import { TmaItem } from '../../../cart/cart-shared';

@Component({
  selector: 'cx-tmf-product',
  templateUrl: './tmf-product.component.html',
  styleUrls: ['./tmf-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TmfProductComponent implements OnInit, OnDestroy {
  @Input()
  tmfProductId: string;
  @Input()
  tmfProduct: TmfProduct;
  @Input()
  subscriptionId?: string;
  @Input()
  order?: TmaOrder;

  tmfProductDetail$: Observable<TmfProduct>;
  currency$: Observable<string>;
  isOwner: boolean;
  baseSiteId: string;
  isEligibleForTermination$: Observable<boolean>;
  status: string;
  protected user: User;
  protected destroyed$ = new Subject();

  constructor(
    public priceService: TmaCartPriceService,
    public recommendationService: RecommendationService,
    protected tmfProductService: TmfProductService,
    protected userOrderService: UserOrderService,
    protected currencyService: CurrencyService,
    protected userService: UserService,
    protected baseSiteService: BaseSiteService
  ) {}

  ngOnInit(): void {
    this.currency$ = this.currencyService.getActive();
    this.userService
      .get()
      .pipe(
        filter((customer: User) => !!customer),
        takeUntil(this.destroyed$)
      )
      .subscribe((customer: User) => (this.user = customer));
    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
    this.isSubscriptionEligibleFor(this.tmfProduct,TmaProcessTypeEnum.TERMINATION);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tmfProductService.clearTmfProductDetails();
  }

  /**
   * Checks if subscribed product is eligible for given process type.
   *
   * @param product 
   *         The subscribed product as {@link TmfProduct}
   * @param processTypeId
   *         The identifier of the processType as {@link string}
   *
   */
  isSubscriptionEligibleFor(product: TmfProduct, processTypeId: string) {
    if (product.status === TmfProductStatus.active) {
      this.isEligibleForTermination$ = this.recommendationService.checkRecommendationsFor(
        this.baseSiteId,
        this.user.uid,
        processTypeId,
        product.productOffering.id,
        this.subscriptionId
      );
    }
  }

  getProductOrderEntry(order: TmaOrder, entryNumber: string): TmaOrderEntry {
    let userOrderEntry: TmaOrderEntry;
    if (!!order && !!order.entries) {
      userOrderEntry = this.getEntry(order.entries, entryNumber);
    }
    return userOrderEntry;
  }

  /**
   * Filters the order entry list with a given entry number.   * 
   *
   * @param entries the list of order entries.
   *
   * @return order entry as {@link TmaOrderEntry}.
   */
  getEntry(entries: TmaOrderEntry[], entryNumber: string): TmaOrderEntry {
    let orderEntry: TmaOrderEntry;
    if (entries) {
      entries.forEach((entry: TmaOrderEntry) => {
        if (entry.entryNumber.toString() === entryNumber) {
          orderEntry = entry;
          return;
        } else {
          let productOrderEntry: TmaOrderEntry;
          productOrderEntry = this.getEntry(entry.entries, entryNumber);
          if (productOrderEntry) {
            orderEntry = productOrderEntry;
            return;
          }
        }
      });
    }
    return orderEntry;
  }

  getPrices(entry: TmaOrderEntry): TmaCartItemPrice {
    if (!!entry) {
      const item: TmaItem = { entryNumber: null };
      Object.assign(item, entry);
      return this.priceService.computeEntryPrice(item);
    }
  }

  getRole(relatedParty: TmaTmfRelatedParty[]): boolean {
    relatedParty.forEach((customer) => {
      if (customer.id === this.user.uid) {
        this.isOwner = customer.role === TmfProductRelatedPartyRole.OWNER;
      }
    });
    return this.isOwner;
  }
}
