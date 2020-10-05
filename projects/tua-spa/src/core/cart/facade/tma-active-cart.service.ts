import { Injectable } from '@angular/core';
import { ActiveCartService, AuthService, MultiCartSelectors, OCC_CART_ID_CURRENT, StateWithMultiCart } from '@spartacus/core';
import { select, Store } from '@ngrx/store';
import { TmaMultiCartService } from './tma-multi-cart.service';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TmaOrderEntry } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaActiveCartService extends ActiveCartService {

  protected tmaActiveCartId$ = this.store.pipe(
    select(MultiCartSelectors.getActiveCartId),
    map(cartId => {
      if (!cartId) {
        return OCC_CART_ID_CURRENT;
      }
      return cartId;
    })
  );

  constructor(
    protected store: Store<StateWithMultiCart>,
    protected authService: AuthService,
    protected multiCartService: TmaMultiCartService
  ) {
    super(store, authService, multiCartService);
  }

  /**
   * Returns cart entry for provided entry number
   *
   * @param entryNumber - The number of the entry
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  getEntryForEntryNumber(entryNumber: number): Observable<TmaOrderEntry> {
    return this.tmaActiveCartId$.pipe(
      switchMap(cartId => this.multiCartService.getEntryForEntryNumber(cartId, entryNumber)),
      distinctUntilChanged()
    );
  }

  /**
   * Returns the SPO cart entry which has the highest entry number for the provided product code
   *
   * @param productCode - The identifier of the product
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  getSpoWithHighestEntryNumber(productCode: string): Observable<TmaOrderEntry> {
    return this.tmaActiveCartId$.pipe(
      switchMap(cartId => this.multiCartService.getSpoWithHighestEntryNumber(cartId, productCode)),
      distinctUntilChanged()
    );
  }
}
