import { Component, OnInit, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model';
import { Observable } from 'rxjs';
import { CurrencyService } from '@spartacus/core';
import { TmaCartPriceService } from '../../../../../../core';

@Component({
  selector: 'cx-cart-item-recurring-charge',
  templateUrl: './cart-item-recurring-charge.component.html',
  styleUrls: ['./cart-item-recurring-charge.component.scss']
})
export class CartItemRecurringChargeComponent implements OnInit {

  @Input()
  recurringCharge: TmaCartPrice[];

  currency$: Observable<string>;

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected currencyService: CurrencyService,
  ) { }

  ngOnInit() {
    this.currency$ = this.currencyService.getActive();
  }

}
