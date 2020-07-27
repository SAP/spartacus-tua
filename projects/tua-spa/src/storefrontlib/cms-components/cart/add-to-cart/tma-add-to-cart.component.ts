import { AddToCartComponent, CurrentProductService, ModalService } from '@spartacus/storefront';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TmaActiveCartService, TmaCartService } from '../../../../core/cart/facade';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { Observable, Subject } from 'rxjs';
import { TmaCart, TmaOrderEntry } from '../../../../core/model';
import { filter, last, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaAddToCartComponent extends AddToCartComponent implements OnInit, OnDestroy {

  currentCart$: Observable<TmaCart>;

  protected destroyed$ = new Subject();

  constructor(
    protected cartService: TmaCartService,
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected activeCartService: TmaActiveCartService
  ) {
    super(cartService, modalService, currentProductService, changeDetectorRef);
    this.currentCart$ = this.activeCartService.getActive();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Adds a SPO to the cart.
   * @param currentCart - The cart in which the SPO will be added
   */
  addSpoToCart(currentCart: TmaCart): void {
    if (!this.productCode || this.quantity <= 0) {
      return;
    }

    this.cartService.addEntry(this.productCode, this.quantity);

    const newEntry$: Observable<TmaOrderEntry> = this.activeCartService.getSpoWithHighestEntryNumber(this.productCode);
    newEntry$
      .pipe(
        take(2),
        filter((newEntry: TmaOrderEntry) => !!newEntry),
        last(),
        takeUntil(this.destroyed$))
      .subscribe((newEntry: TmaOrderEntry) => {
        this.increment = newEntry.quantity > 1;
        this.openAddToCartModal(newEntry$);
      });
  }

  protected openAddToCartModal(entry$: Observable<TmaOrderEntry>) {
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
      centered: true,
      size: 'lg'
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = entry$;
    modalInstance.cart$ = this.cartService.getActive();
    modalInstance.loaded$ = this.cartService.getLoaded();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
  }
}
