import { Component, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model';

@Component({
  selector: 'cx-cart-item-one-time-charge',
  templateUrl: './cart-item-one-time-charge.component.html',
})
export class CartItemOneTimeChargeComponent{
  @Input()
  oneTimeCharge: TmaCartPrice;

  constructor() {}

}
