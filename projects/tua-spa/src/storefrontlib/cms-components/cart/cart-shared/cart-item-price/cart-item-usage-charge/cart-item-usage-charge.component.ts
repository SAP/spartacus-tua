import { Component, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model';


@Component({
  selector: 'cx-cart-item-usage-charge',
  templateUrl: './cart-item-usage-charge.component.html',
})
export class CartItemUsageChargeComponent{
  @Input()
  usageCharge: TmaCartPrice;

  constructor() {}
}
