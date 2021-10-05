import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as TmfProductSelectors from '../store/selectors';
import { takeUntil, tap } from 'rxjs/operators';
import { TmaStateWithTmfProduct, TmfProductMap } from '../store';
import * as TmfProductActions from '../store/actions/tmf-product.action';
import { BaseSiteService } from '@spartacus/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class TmfProductService implements OnDestroy {
  protected baseSiteId: string;
  protected destroyed$ = new Subject();

  constructor(
    protected store: Store<TmaStateWithTmfProduct>,
    protected baseSiteService: BaseSiteService
  ) {
    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns a TmfProduct details
   * @param tmfProductId The identifier of the TmfProduct
   * @returns TmfProduct details {@link TmfProduct} as an {@link Observable}
   */
  getTmfProductDetails(tmfProductId: string): Observable<TmfProductMap> {
    return this.store.pipe(
      select(TmfProductSelectors.getTmfProduct, {
        baseSiteId: this.baseSiteId,
        tmfProductId: tmfProductId,
      }),
      tap((product: TmfProductMap) => {
        if (product == null) {
          this.loadTmfProductDetails(this.baseSiteId, tmfProductId);
        }
      })
    );
  }

  /**
   * Loads the TmfProduct details.
   *
   * @param baseSiteId The identifier of the base site
   * @param tmfProductId The identifier of the TmfProduct
   */
  loadTmfProductDetails(baseSiteId: string, tmfProductId: string): void {
    this.store.dispatch(
      new TmfProductActions.LoadTmfProduct({
        baseSiteId,
        tmfProductId,
      })
    );
  }

  /**
   * Clears the TmfProduct details.
   */
  clearTmfProductDetails(): void {
    this.store.dispatch(new TmfProductActions.ClearTmfProduct());
  }

 /**
   * Retrives the TmfProductMap for given product id.
   * 
   * @param tmfProductId The identifier of the TmfProduct
   * @returns TmfProductMap details {@link TmfProductMap} as an {@link Observable}
   */
  getTmfProductMap(tmfProductId: string): Observable<TmfProductMap> {
    return this.store.pipe(
      select(TmfProductSelectors.getTmfProductMap, {
        baseSiteId: this.baseSiteId,
        tmfProductId: tmfProductId
      }),
      tap((product: TmfProductMap) => {
        if (product == null) {
          this.loadTmfProductDetails(this.baseSiteId, tmfProductId);
        }
      })
    );
  }
}
