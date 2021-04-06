import { ActiveCartService, StateWithMultiCart, MultiCartService, UserIdService, Cart, OCC_USER_ID_ANONYMOUS, User, MultiCartSelectors, OCC_CART_ID_CURRENT, StateUtils } from '@spartacus/core';
import * as TmaCartEntryActions from '../store/actions/tma-cart-entry.actions';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TmaOrderEntry } from '../../model';
import { ModalService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { getCartIdByUserId, isTempCartId } from '../utils/utils';
import { TmaMultiCartService } from './tma-multi-cart.service';

@Injectable({
  providedIn: 'root'
})
export class TmaCartService extends ActiveCartService {

  private readonly PREVIOUS_USER_INITIAL_VALUE = 'PREVIOUS_USER_ID_INITIAL_VALUE';
  private _previousUserId = this.PREVIOUS_USER_INITIAL_VALUE;
  private _activeCart$: Observable<Cart>;

  private _userId = OCC_USER_ID_ANONYMOUS;
  private _cartId;
  private _cartUser: User;

  private _activeCartId$ = this.store.pipe(
    select(MultiCartSelectors.getActiveCartId),
    map((cartId) => {
      if (!cartId) {
        return OCC_CART_ID_CURRENT;
      }
      return cartId;
    })
  );
  private _cartSelector$ = this._activeCartId$.pipe(
    switchMap((cartId) => this.multiCartService.getCartEntity(cartId))
  );

  constructor(
    protected store: Store<StateWithMultiCart>,
    protected multiCartService: MultiCartService,
    protected tmaMultiCartService: TmaMultiCartService,
    protected userIdService: UserIdService,
    protected modalService: ModalService,
  ) {
    super(store,  multiCartService, userIdService);
    this.initActiveShoppingCart();
  }

  /**
   * Adds the provided entry to the current cart.
   *
   * @param cartEntry - The entry to be added to the cart
   */
  addCartEntry(cartEntry: TmaOrderEntry): void {
    this.requireLoadedShoppingCart()
      .pipe(withLatestFrom(this.userIdService.getUserId()))
      .subscribe(([cartState, userId]) => {
        this.tmaMultiCartService.addCartEntry(
          userId,
          getCartIdByUserId(cartState.value, userId),
          cartEntry
        );
      });
  }

  /**
   * Updates the provided entry.
   *
   * @param cartEntry - The entry to be updated in the cart
   */
  updateCartEntry(cartEntry: TmaOrderEntry): void {
    this.requireLoadedShoppingCart()
      .pipe(withLatestFrom(this.userIdService.getUserId()), take(1))
      .subscribe(([cartState, userId]) => {
        this.tmaMultiCartService.updateCartEntry(
          userId,
          getCartIdByUserId(cartState.value, userId),
          cartEntry
        );
      });
  }

  /**
   * @deprecated since 2.1
   */
  loadCart() {
    this.store.dispatch(new TmaCartEntryActions.LoadCart({
      userId: this.userIdService.getUserId(),
      cartId: this.getActiveCartId()
    }));
  }

  protected initActiveShoppingCart() {
    this.subscription.add(
      this.userIdService.getUserId().subscribe((userId) => {
        this._userId = userId;
        if (this._userId !== OCC_USER_ID_ANONYMOUS) {
          if (this.isUserJustLoggedIn(userId)) {
            this.loadOrMergeShoppingCart(this._cartId);
          }
        }
        this._previousUserId = userId;
      })
    );

    this.subscription.add(
      this._activeCartId$.subscribe((cartId) => {
        this._cartId = cartId;
      })
    );

    this._activeCart$ = this._cartSelector$.pipe(
      withLatestFrom(this._activeCartId$),
      map(([cartEntity, activeCartId]: [StateUtils.ProcessesLoaderState<Cart>, string]): {
        cart: Cart;
        cartId: string;
        isStable: boolean;
        loaded: boolean;
      } => {
        return {
          cart: cartEntity.value,
          cartId: activeCartId,
          isStable: !cartEntity.loading && cartEntity.processesCount === 0,
          loaded:
            (cartEntity.error || cartEntity.success) && !cartEntity.loading
        };
      }),
      // we want to emit empty carts even if those are not stable
      // on merge cart action we want to switch to empty cart so no one would use old cartId which can be already obsolete
      // so on merge action the resulting stream looks like this: old_cart -> {} -> new_cart
      filter(({ isStable, cart }) => isStable || this.isEmptyShoppingCart(cart)),
      tap(({ cart, cartId, loaded, isStable }) => {
        if (
          isStable &&
          this.isEmptyShoppingCart(cart) &&
          !loaded &&
          !isTempCartId(cartId)
        ) {
          this.loadShoppingCart(cartId);
        }
      }),
      map(({ cart }) => (cart ? cart : {})),
      tap((cart) => {
        if (cart) {
          this._cartUser = cart.user;
        }
      }),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  protected loadOrMergeShoppingCart(cartId: string): void {
    // for login user, whenever there's an existing cart, we will load the user
    // current cart and merge it into the existing cart
    if (!cartId || cartId === OCC_CART_ID_CURRENT) {
      this.multiCartService.loadCart({
        userId: this._userId,
        cartId: OCC_CART_ID_CURRENT,
        extraData: {
          active: true
        }
      });
    }
    else if (this.isGuestCart()) {
      this.guestShoppingCartMerge(cartId);
    }
    else {
      this.multiCartService.mergeToCurrentCart({
        userId: this._userId,
        cartId,
        extraData: {
          active: true
        }
      });
    }
  }

  private loadShoppingCart(_cartId: string): void {
    if (this._userId !== OCC_USER_ID_ANONYMOUS) {
      this.multiCartService.loadCart({
        userId: this._userId,
        cartId: _cartId ? _cartId : OCC_CART_ID_CURRENT,
        extraData: {
          active: true
        }
      });
    }
    else if (_cartId && _cartId !== OCC_CART_ID_CURRENT) {
      this.multiCartService.loadCart({
        userId: this._userId,
        cartId: _cartId,
        extraData: {
          active: true
        }
      });
    }
  }

  private isShoppingCartCreating(cartState) {
    // cart creating is always represented with loading flags
    // when all loading flags are false it means that we restored wrong cart id
    // could happen on context change or reload right in the middle on cart create call
    return (
      isTempCartId(this._cartId) &&
      (cartState.loading || cartState.success || cartState.error)
    );
  }

  private requireLoadedShoppingCart(
    customCartSelector$?: Observable<StateUtils.ProcessesLoaderState<Cart>>
  ): Observable<StateUtils.ProcessesLoaderState<Cart>> {
    // For guest cart merge we want to filter guest cart in the whole stream
    // We have to wait with load/create/addEntry after guest cart will be deleted.
    // That's why you can provide custom selector with this filter applied.
    const _cartSelector$ = customCartSelector$
      ? customCartSelector$
      : this._cartSelector$;

    return _cartSelector$.pipe(
      filter((cartState) => !cartState.loading),
      // Avoid load/create call when there are new cart creating at the moment
      filter((cartState) => !this.isShoppingCartCreating(cartState)),
      take(1),
      switchMap((cartState) => {
        // Try to load the cart, because it might have been created on another device between our login and add entry call
        if (
          this.isEmptyShoppingCart(cartState.value) &&
          this._userId !== OCC_USER_ID_ANONYMOUS
        ) {
          this.loadShoppingCart(undefined);
        }
        return _cartSelector$;
      }),
      filter((cartState) => !cartState.loading),
      // create cart can happen to anonymous user if it is not empty or to any other user if it is loaded and empty
      filter(
        (cartState) =>
          this._userId === OCC_USER_ID_ANONYMOUS ||
          cartState.success ||
          cartState.error
      ),
      take(1),
      switchMap((cartState) => {
        if (this.isEmptyShoppingCart(cartState.value)) {
          this.multiCartService.createCart({
            userId: this._userId,
            extraData: {
              active: true
            }
          });
        }
        return _cartSelector$;
      }),
      filter((cartState) => !cartState.loading),
      filter((cartState) => cartState.success || cartState.error),
      // wait for active cart id to point to code/guid to avoid some work on temp cart entity
      filter((cartState) => !this.isShoppingCartCreating(cartState)),
      filter((cartState) => !this.isEmptyShoppingCart(cartState.value)),
      take(1)
    );
  }

  private addCartEntriesGuestMerge(cartEntries: TmaOrderEntry[]) {
    const entriesToAdd = cartEntries.map((entry) => ({
      productCode: entry.product.code,
      quantity: entry.quantity
    }));
    this.requireLoadedShoppingCartForGuestMerge().subscribe((cartState) => {
      this.multiCartService.addEntries(
        this._userId,
        getCartIdByUserId(cartState.value, this._userId),
        entriesToAdd
      );
    });
  }

  private requireLoadedShoppingCartForGuestMerge() {
    return this.requireLoadedShoppingCart(
      this._cartSelector$.pipe(filter(() => !this.isGuestCart()))
    );
  }

  private guestShoppingCartMerge(cartId: string): void {
    let cartEntries: TmaOrderEntry[];
    this.getEntries()
      .pipe(take(1))
      .subscribe((entries) => {
        cartEntries = entries;
      });

    this.multiCartService.deleteCart(cartId, OCC_USER_ID_ANONYMOUS);

    this.addCartEntriesGuestMerge(cartEntries);
  }

  private isUserJustLoggedIn(userId: string): boolean {
    return (
      this._previousUserId !== userId && // *just* logged in
      this._previousUserId !== this.PREVIOUS_USER_INITIAL_VALUE // not app initialization
    );
  }

  private isEmptyShoppingCart(cart: Cart): boolean {
    return (
      !cart || (typeof cart === 'object' && Object.keys(cart).length === 0)
    );
  }
}
