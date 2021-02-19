import { ActiveCartService, AuthService, CartActions, CartDataService, CartService, StateWithCart } from '@spartacus/core';
import * as TmaCartEntryActions from '../store/actions/tma-cart-entry.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TmaOrderEntry } from '../../model/tma-cart.entry.model';

@Injectable({
  providedIn: 'root'
})
export class TmaCartService extends CartService {

  constructor(
    protected store: Store<StateWithCart>,
    protected cartData: CartDataService,
    protected authService: AuthService,
    protected activeCartService: ActiveCartService
  ) {
    super(store, cartData, authService, activeCartService);
  }

  addCartEntry(cartEntry: TmaOrderEntry): void {
    this.store.dispatch(
      new TmaCartEntryActions.AddCartEntry({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        cartEntry
      })
    );
  }

  updateCartEntry(cartEntry: TmaOrderEntry): void {
    this.store.dispatch(
      new TmaCartEntryActions.UpdateCartEntry({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        cartEntry
      })
    );
  }

  loadCart() {
    this.store.dispatch(new CartActions.LoadCart({
      userId: this.cartData.userId,
      cartId: this.cartData.cartId
    }));
  }
}
