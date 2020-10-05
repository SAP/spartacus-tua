import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TmfProductService } from '../../../../../core/subscription/tmf-product/facade';
import {
  TmfProduct,
  TmfProductRelatedPartyRole,
  TmfProductStatus,
  TmaOrderEntry,
  TmaCartItemPrice,
  TmaOrder,
  TmaTmfRelatedParty,
} from '../../../../../core/model';
import {
  UserOrderService,
  CurrencyService,
  User,
  UserService,
} from '@spartacus/core';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { TmaCartPriceService } from '../../../../../core/cart/facade';
import { TmaItem } from '../../../cart/cart-shared';

@Component({
  selector: 'cx-tmf-product',
  templateUrl: './tmf-product.component.html',
  styleUrls: ['./tmf-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TmfProductComponent implements OnInit, OnDestroy {
  @Input()
  tmfProductId: string;
  tmfProductDetail$: Observable<TmfProduct>;
  currency$: Observable<string>;
  isOwner: boolean;
  protected user: User;
  protected destroyed$ = new Subject();

  constructor(
    public priceService: TmaCartPriceService,
    protected tmfProductService: TmfProductService,
    protected userOrderService: UserOrderService,
    protected currencyService: CurrencyService,
    protected userService: UserService
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
    this.tmfProductDetail$ = this.tmfProductService.getTmfProductDetails(
      this.tmfProductId
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tmfProductService.clearTmfProductDetails();
  }

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

  getProductOrderEntry(order: TmaOrder, entryNumber: string): TmaOrderEntry {
    let userOrderEntry: TmaOrderEntry;
    if (!!order && !!order.entries) {
      order.entries.filter((entry: TmaOrderEntry) => {
        if (entry.entryNumber.toString() === entryNumber) {
          userOrderEntry = entry;
        }
      });
    }
    return userOrderEntry;
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

  getProductStatus(product: TmfProduct): boolean {
    if (product.status === TmfProductStatus.ACTIVE) {
      return true;
    }
    if (product.status === TmfProductStatus.CANCELLED) {
      return false;
    }
  }
}
