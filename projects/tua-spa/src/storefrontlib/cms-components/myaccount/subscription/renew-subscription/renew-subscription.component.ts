import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  TmaTmfShoppingCart,
  TmaTmfActionType,
  TmaSubscriptionTerm,
  TmaOrderEntry,
  TmaCart,
  TmaProcessTypeEnum,
  TmfProduct,
  TmaProduct,
  RecommendationService,
  TmaActiveCartService,
  TmaTmfCartService,
  TmaProductService,
  SubscriptionTermService
} from '../../../../../core';
import {
  UserService,
  BaseSiteService,
  User,
  UserOrderService,
  OCC_USER_ID_ANONYMOUS
} from '@spartacus/core';
import { Subject, Observable, of } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { TmaAddedToCartDialogComponent } from '../../../cart';

@Component({
  selector: 'cx-renew-subscription',
  templateUrl: './renew-subscription.component.html',
  styleUrls: ['./renew-subscription.component.scss']
})
export class RenewSubscriptionComponent implements OnInit, OnDestroy {
  @Input()
  subscription: TmfProduct;
  @Input()
  subscribedProducts: TmfProduct[];
  @Input()
  buttonText: string;

  baseSiteId: string;
  user: User;
  currentCart$: Observable<TmaCart>;
  parentBpo: TmaProduct;
  increment: boolean;
  productCodes: string[] = [];
  protected destroyed$ = new Subject();
  protected modalRef: ModalRef;

  constructor(
    public subscriptionTermService: SubscriptionTermService,
    protected userService: UserService,
    protected baseSiteService: BaseSiteService,
    protected recommendationService: RecommendationService,
    protected activeCartService: TmaActiveCartService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected userOrderService: UserOrderService,
    protected spinner: NgxSpinnerService,
    protected modalService: ModalService,
    protected tmaProductService: TmaProductService
  ) {}

  ngOnInit(): void {
    this.currentCart$ = this.activeCartService.getActive();
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
    this.recommendationService.clearRecommendationState();
  }

  /**
   * Adding the product to cart for renew
   *
   * @param currentCart - cart with subscribed products for renew
   * @param subscriptionTerm - subscription term
   */
  addToCartForRenewal(
    currentCart: TmaCart,
    subscriptionTerm: TmaSubscriptionTerm
  ): void {
    if (!this.subscription.isBundle) {
      this.addToCartSpoRenewal(currentCart, subscriptionTerm);
    }
  }

  protected addToCartSpoRenewal(
    currentCart: TmaCart,
    subscriptionTerm: TmaSubscriptionTerm
  ): void {
    const currentUserId: string =
      this.user && this.user.uid ? this.user.uid : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      id: currentCart.code,
      guid: currentUserId === OCC_USER_ID_ANONYMOUS ? currentCart.guid : null,
      baseSiteId: this.baseSiteId,
      cartItem: [
        {
          processType: {
            id: TmaProcessTypeEnum.RENEWAL
          },
          action: TmaTmfActionType.KEEP,
          product: {
            id: this.subscribedProducts[0].id
          },
          quantity: 1,
          itemTerm: [subscriptionTerm]
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.addToCart(shoppingCart, currentCart);
  }

  protected getNewlyAddedEntries(
    oldCart: TmaCart,
    newCart: TmaCart
  ): TmaOrderEntry[] {
    const entriesWithLastAdded: number[] = [];
    const entriesWithoutLastAdded: number[] = [];
    newCart.entries.forEach((entry: TmaOrderEntry) =>
      entriesWithLastAdded.push(entry.entryNumber)
    );

    if (oldCart.entries) {
      oldCart.entries.forEach((entry: TmaOrderEntry) =>
        entriesWithoutLastAdded.push(entry.entryNumber)
      );
    }

    const newlyAddedEntryIds: number[] = entriesWithLastAdded.filter(
      (entryNumber: number) => entriesWithoutLastAdded.indexOf(entryNumber) < 0
    );

    const newlyAddedEntries: TmaOrderEntry[] = [];
    newlyAddedEntryIds.forEach((entryNumber: number) =>
      newlyAddedEntries.push(
        newCart.entries.find(
          (entry: TmaOrderEntry) => entry.entryNumber === entryNumber
        )
      )
    );

    return newlyAddedEntries;
  }

  protected addToCart(
    shoppingCart: TmaTmfShoppingCart,
    currentCart: TmaCart
  ): void {
    this.tmaTmfCartService.updateCart(shoppingCart);
    this.spinner.show();
    this.activeCartService
      .getActive()
      .pipe(
        first(
          (cart: TmaCart) =>
            cart &&
            cart.entries &&
            cart.entries.length >
              (currentCart && currentCart.entries
                ? currentCart.entries.length
                : 0)
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe((newCart: TmaCart) => {
        const newlyAddedEntries: TmaOrderEntry[] = this.tmaTmfCartService.getNewlyAddedEntries(
          currentCart,
          newCart
        );
        if (newlyAddedEntries) {
          this.spinner.hide();
          this.increment = newlyAddedEntries[0].quantity > 1;
          this.openAddToCartModal(of(newlyAddedEntries[0]));
        }
      });
  }

  protected openAddToCartModal(entry$: Observable<TmaOrderEntry>): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
      centered: true,
      size: 'lg',
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = entry$;
    modalInstance.cart$ = this.activeCartService.getActive();
    modalInstance.loaded$ = this.activeCartService.isStable();
    modalInstance.quantity = 1;
    modalInstance.increment = this.increment;
  }
}
