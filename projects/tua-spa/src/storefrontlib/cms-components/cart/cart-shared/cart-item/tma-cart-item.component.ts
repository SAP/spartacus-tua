import { Component, Input, OnInit } from '@angular/core';
import { CartItemComponent, Item, PromotionService } from '@spartacus/storefront';
import { CurrencyService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaProduct, TmaCartPrice, TmaSubscribedProduct } from '../../../../../core/model';
import { TmaCartPriceService } from '../../../../../core/cart/facade';

export interface TmaItem extends Item {
  entryNumber: number;
  subscribedProduct?: TmaSubscribedProduct;
  cartPrice: TmaCartPrice;
}

@Component({
  selector: 'cx-cart-item',
  templateUrl: './tma-cart-item.component.html',
  styleUrls: ['./tma-cart-item.component.scss']
})
export class TmaCartItemComponent extends CartItemComponent implements OnInit {

  @Input()
  item: TmaItem;

  @Input()
  displayPrices = true;

  product$: Observable<TmaProduct>;
  currency$: Observable<string>;

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected currencyService: CurrencyService,
    protected promotionService: PromotionService,
  ) {
    super(promotionService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
  }
}
