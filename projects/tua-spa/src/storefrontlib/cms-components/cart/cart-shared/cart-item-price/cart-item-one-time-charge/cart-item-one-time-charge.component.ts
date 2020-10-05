import { Component, OnInit, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model';
import { CurrencyService } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-cart-item-one-time-charge',
  templateUrl: './cart-item-one-time-charge.component.html',
  styleUrls: ['./cart-item-one-time-charge.component.scss'],
})
export class CartItemOneTimeChargeComponent implements OnInit {
  @Input()
  oneTimeCharge: TmaCartPrice[];

  currency$: Observable<string>;

  constructor(protected currencyService: CurrencyService) {}

  ngOnInit() {
    this.currency$ = this.currencyService.getActive();
  }
}
