import { AddToCartComponent, CurrentProductService, ModalService } from '@spartacus/storefront';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TmaCartService } from '../../../../core/cart/facade';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';
@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaAddToCartComponent extends AddToCartComponent {

  constructor(
    protected cartService: TmaCartService,
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(cartService, modalService, currentProductService, changeDetectorRef);
  }

  addToCart() {
    if (!this.productCode || this.quantity <= 0) {
      return;
    }
    // check item is already present in the cart
    // so modal will have proper header text displayed
    this.cartService
      .getEntry(this.productCode)
      .subscribe(entry => {
        if (entry) {
          this.increment = true;
        }
        this.openAddToCartModal();
        this.cartService.addEntry(this.productCode, this.quantity);
        this.increment = false;
      })
      .unsubscribe();
  }

  protected openAddToCartModal() {
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
      centered: true,
      size: 'lg',
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = this.cartEntry$;
    modalInstance.cart$ = this.cartService.getActive();
    modalInstance.loaded$ = this.cartService.getLoaded();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
  }
}
