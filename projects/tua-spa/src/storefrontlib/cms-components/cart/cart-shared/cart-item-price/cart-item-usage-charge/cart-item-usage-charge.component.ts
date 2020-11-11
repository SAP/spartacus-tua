import { Component, OnInit, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model'
import { TmaCartPriceService } from '../../../../../../core';
import { CurrencyService } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-cart-item-usage-charge',
  templateUrl: './cart-item-usage-charge.component.html',
  styleUrls: ['./cart-item-usage-charge.component.scss']
})
export class CartItemUsageChargeComponent implements OnInit {

  @Input()
  usageCharge: TmaCartPrice[];


  currency$: Observable<string>;

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected currencyService: CurrencyService,
  ) { }

  ngOnInit() {
    this.currency$ = this.currencyService.getActive();
  }

}
