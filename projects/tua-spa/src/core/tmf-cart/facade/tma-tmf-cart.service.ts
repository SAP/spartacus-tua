import { Injectable, OnDestroy } from '@angular/core';
import {
  AuthService,
  Cart,
  MultiCartSelectors,
  MultiCartService,
  OCC_CART_ID_CURRENT,
  OCC_USER_ID_ANONYMOUS,
  StateWithMultiCart
} from '@spartacus/core';
import { select, Store } from '@ngrx/store';
import * as TmaCartActions from '../store/actions/tma-tmf-cart.action';
import { TmaTmfShoppingCart, TmaCart, TmaOrderEntry } from '../../model';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ProcessesLoaderState } from '@spartacus/core/src/state/utils/utils-group';


@Injectable({
  providedIn: 'root'
})
export class TmaTmfCartService implements OnDestroy {

  protected readonly OBJECT = 'object';
  protected readonly TEMP = 'temp-';

  protected cartId: string;
  protected userId: string = OCC_USER_ID_ANONYMOUS;

  protected destroyed$ = new Subject();

  protected activeCartId$ = this.store.pipe(
    select(MultiCartSelectors.getActiveCartId),
    map((cartId: string) => {
      if (!cartId) {
        return OCC_CART_ID_CURRENT;
      }
      return cartId;
    })
  );

  protected cartSelector$ = this.activeCartId$.pipe(
    switchMap((cartId: string) => this.multiCartService.getCartEntity(cartId))
  );

  constructor(
    protected store: Store<StateWithMultiCart>,
    protected multiCartService: MultiCartService,
    protected authService: AuthService
  ) {
    this.authService.getOccUserId()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((userId: string) =>
        this.userId = userId
      );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Updates the shopping cart.
   *
   * @param shoppingCart - The shopping cart to be updated
   */
  updateCart(shoppingCart: TmaTmfShoppingCart): void {
    this.requireLoadedCart()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((cartState: ProcessesLoaderState<Cart>) => {
        shoppingCart.id = cartState.value.code;
        shoppingCart.guid = cartState.value.guid;
        this.store.dispatch(
          new TmaCartActions.UpdateCart({ shoppingCart: shoppingCart })
        );
      });
  }

   /**
   * Gets the newly added entries of the cart by comparing the entries before and after add to cart
   *
   * @param oldCart - Cart before add to cart
   * @param newCart - Cart after add to cart 
   * @return - TmaOrderEntry[] The newly added entries of the cart
   */
  public getNewlyAddedEntries(
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

  protected requireLoadedCart(customCartSelector$?: Observable<ProcessesLoaderState<Cart>>): Observable<ProcessesLoaderState<Cart>> {
    const cartSelector$ = customCartSelector$ ? customCartSelector$ : this.cartSelector$;

    return cartSelector$.pipe(
      filter((cartState: ProcessesLoaderState<Cart>) => !cartState.loading),
      filter((cartState: ProcessesLoaderState<Cart>) => !this.isCartCreating(cartState)),
      take(1),
      switchMap((cartState: ProcessesLoaderState<Cart>) => {
        if (this.isEmpty(cartState.value) && this.userId !== OCC_USER_ID_ANONYMOUS) {
          this.load(undefined);
        }
        return cartSelector$;
      }),
      filter((cartState: ProcessesLoaderState<Cart>) => !cartState.loading),
      filter((cartState: ProcessesLoaderState<Cart>) => this.userId === OCC_USER_ID_ANONYMOUS || (cartState.success || cartState.error)
      ),
      take(1),
      switchMap((cartState: ProcessesLoaderState<Cart>) => {
        if (this.isEmpty(cartState.value)) {
          this.multiCartService.createCart({
            userId: this.userId,
            extraData: {
              active: true,
            },
          });
        }
        return cartSelector$;
      }),
      filter((cartState: ProcessesLoaderState<Cart>) => !cartState.loading),
      filter((cartState: ProcessesLoaderState<Cart>) => cartState.success || cartState.error),
      filter((cartState: ProcessesLoaderState<Cart>) => !this.isCartCreating(cartState)),
      filter((cartState: ProcessesLoaderState<Cart>) => !this.isEmpty(cartState.value)),
      take(1)
    );
  }

  protected isCartCreating(cartState: ProcessesLoaderState<Cart>): boolean {
    return this.isTempCartId(this.cartId) && (cartState.loading || cartState.success || cartState.error);
  }

  protected load(cartId: string): void {
    if (this.userId !== OCC_USER_ID_ANONYMOUS) {
      this.multiCartService.loadCart({
        userId: this.userId,
        cartId: cartId ? cartId : OCC_CART_ID_CURRENT,
        extraData: {
          active: true
        }
      });
    } else if (cartId && cartId !== OCC_CART_ID_CURRENT) {
      this.multiCartService.loadCart({
        userId: this.userId,
        cartId: cartId,
        extraData: {
          active: true
        }
      });
    }
  }

  protected isEmpty(cart: Cart): boolean {
    return !cart || (typeof cart === this.OBJECT && Object.keys(cart).length === 0);
  }

  protected isTempCartId(cartId: string): boolean {
    return cartId && cartId.startsWith(this.TEMP);
  }
}
