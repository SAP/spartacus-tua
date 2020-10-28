import { AddedToCartDialogComponent, ModalService, PromotionService } from '@spartacus/storefront';
import { Component, OnInit } from '@angular/core';
import { TmaCartPriceService, TmaCartService } from '../../../../../core/cart/facade';
import { CurrencyService } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-added-to-cart-dialog',
  templateUrl: './tma-added-to-cart-dialog.component.html'
})
export class TmaAddedToCartDialogComponent extends AddedToCartDialogComponent implements OnInit {

  currency$: Observable<string>;

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected modalService: ModalService,
    protected cartService: TmaCartService,
    protected currencyService: CurrencyService,
    protected promotionService: PromotionService,
  ) {
    super(modalService, cartService, promotionService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
  }
}
