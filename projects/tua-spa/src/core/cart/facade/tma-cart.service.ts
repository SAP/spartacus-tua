import { ActiveCartService, AuthService, StateWithMultiCart, MultiCartService } from '@spartacus/core';
import * as TmaCartEntryActions from '../store/actions/tma-cart-entry.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TmaOrderEntry } from '../../model';
import { ModalService } from '@spartacus/storefront';

@Injectable({
  providedIn: 'root'
})
export class TmaCartService extends ActiveCartService {

  constructor(
    protected store: Store<StateWithMultiCart>,
    protected authService: AuthService,
    protected multiCartService: MultiCartService,
    protected modalService: ModalService,
  ) {
    super(store, authService, multiCartService);
  }

  addCartEntry(cartEntry: TmaOrderEntry): void {
    this.store.dispatch(
      new TmaCartEntryActions.AddCartEntry({
        userId: this.authService.getOccUserId(),
        cartId: this.getActiveCartId(),
        cartEntry
      })
    );
  }

  updateCartEntry(cartEntry: TmaOrderEntry): void {
    this.store.dispatch(
      new TmaCartEntryActions.UpdateCartEntry({
        userId: this.authService.getOccUserId(),
        cartId: this.getActiveCartId(),
        cartEntry
      })
    );
  }

  loadCart() {
    this.store.dispatch(new TmaCartEntryActions.LoadCart({
      userId: this.authService.getOccUserId(),
      cartId: this.getActiveCartId(),
    }));
  }
}
