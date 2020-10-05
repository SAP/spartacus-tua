import { Injectable } from '@angular/core';
import { MultiCartService, StateWithMultiCart } from '@spartacus/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TmaOrderEntry } from '../../model';
import { TmaMultiCartSelectors } from '../store/selectors';

@Injectable({
  providedIn: 'root'
})
export class TmaMultiCartService extends MultiCartService {

  constructor(
    protected store: Store<StateWithMultiCart>
  ) {
    super(store);
  }

  /**
   * Returns cart entry for provided entry number
   *
   * @param cartId - The identifier of the cart
   * @param entryNumber - The number of the entry
   * @return A {@link TmaOrderEntry} as an {@link Observable}
   */
  getEntryForEntryNumber(cartId: string, entryNumber: number): Observable<TmaOrderEntry | null> {
    return this.store.select(TmaMultiCartSelectors.getCartEntryForEntryNumberSelectorFactory(cartId, entryNumber));
  }

  /**
   * Returns the SPO cart entry which has the highest entry number for the provided product code
   *
   * @param cartId - The identifier of the cart
   * @param productCode - The identifier of the product
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  getSpoWithHighestEntryNumber(cartId: string, productCode: string): Observable<TmaOrderEntry | null> {
    return this.store.select(TmaMultiCartSelectors.getSpoWithHighestEntryNumberSelectorFactory(cartId, productCode));
  }

}
