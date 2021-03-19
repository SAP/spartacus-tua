import { Component, Input, OnInit } from '@angular/core';
import {
  BaseSiteService,
  OCC_USER_ID_ANONYMOUS,
  User,
  UserService
} from '@spartacus/core';
import { ModalService } from '@spartacus/storefront';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import {
  TmaActiveCartService,
  TmaTmfCartService
} from '../../../../../../../core/';
import {
  TmaCart,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaTmfActionType,
  TmaTmfShoppingCart,
  TmfProduct
} from '../../../../../../../core/model';
import { TmaAddedToCartDialogComponent } from '../../../../../cart/add-to-cart/added-to-cart-dialog/tma-added-to-cart-dialog.component';

@Component({
  selector: 'cx-termination-button',
  templateUrl: './termination-button.component.html',
  styleUrls: ['./termination-button.component.scss']
})
export class TerminationButtonComponent implements OnInit {
  @Input()
  product: TmfProduct;
  modalRef: any;
  user: User;
  baseSiteId: string;
  increment: boolean;
  currentCart$: Observable<TmaCart>;
  protected destroyed$ = new Subject();

  constructor(
    protected modalService: ModalService,
    protected userService: UserService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected spinner: NgxSpinnerService,
    protected activeCartService: TmaActiveCartService,
    protected baseSiteService: BaseSiteService
  ) {}

  ngOnInit(): void {
    this.currentCart$ = this.activeCartService.getActive();
    this.userService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((customer: User) => (this.user = customer));
    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
  }

  /**
   * Perform Add to Cart Action for the subscribed product to be terminated.
   *
   * @param currentCart  Active Cart of the user {@link TmaCart}
   *
   */
  addToCart(currentCart: TmaCart): void {
    const currentUserId: string =
      this.user && this.user.uid ? this.user.uid : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      id: currentCart.code,
      guid: currentUserId === OCC_USER_ID_ANONYMOUS ? currentCart.guid : null,
      baseSiteId: this.baseSiteId,
      cartItem: [
        {
          processType: {
            id: TmaProcessTypeEnum.TERMINATION
          },
          action: TmaTmfActionType.REMOVE,
          product: {
            id: this.product.id
          },
          quantity: 1
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
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
      size: 'lg'
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = entry$;
    modalInstance.cart$ = this.activeCartService.getActive();
    modalInstance.loaded$ = this.activeCartService.isStable();
    modalInstance.quantity = 1;
    modalInstance.increment = this.increment;
  }
}
