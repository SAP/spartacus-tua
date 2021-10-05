import { Component } from '@angular/core';
import {
  OrderDetailShippingComponent,
  OrderDetailsService
} from '@spartacus/storefront';

@Component({
  selector: 'cx-order-details-shipping',
  templateUrl: './tma-order-detail-shipping.component.html'
})
export class TmaOrderDetailShippingComponent extends OrderDetailShippingComponent {
  constructor(protected orderDetailsService: OrderDetailsService) {
    super(orderDetailsService);
  }
}
