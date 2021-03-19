import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  ProductSearchService,
  SearchConfig,
  StateWithProduct,
  User,
  UserService,
  ProductActions
} from '@spartacus/core';
import { first, takeUntil } from 'rxjs/operators';
import * as TmaProductSearchAction from '../store/actions/tma-product-search.action';

@Injectable({
  providedIn: 'root'
})
export class TmaProductSearchService extends ProductSearchService implements OnInit {
  addToCart: Boolean = false;

  @Output()
  submitEvent = new EventEmitter<any>();

  protected currentUser: User;
  protected destroyed$ = new Subject();

  constructor(
    protected store: Store<StateWithProduct>,
    protected userService?: UserService
  ) {
    super(store);
  }

  ngOnInit(): void {
    this.userService
      .get()
      .pipe(
        first((user: User) => user != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));
  }

  /**
   * Performs a product search. In case if serviceability button component is present
   * then custom product search is perfomed and filter out the serviceable product at the given input address
   *
   * @param query as {@link string}
   * @param searchConfig as {@link SearchConfig}
   */
  searchProduct(
    queries: string[],
    searchConfig?: SearchConfig,
    serviceableComponent?: boolean
  ): void {
    if (serviceableComponent) {
      this.store.dispatch(
        new TmaProductSearchAction.TmaSearchProducts({
          queryText: queries,
          searchConfig: searchConfig
        })
      );
      this.addToCart = true;
    } else {
      this.addToCart = false;
      this.store.dispatch(
        new ProductActions.SearchProducts({
          queryText: queries[0],
          searchConfig: searchConfig
        })
      );
    }
  }

  /**
   * If the product is serviceable then return true (show add to cart button instead
   * of see details button)
   *
   * @returns of {@link Boolean}
   */
  addToCartServiceableProduct(): Boolean {
    return this.addToCart;
  }
}
