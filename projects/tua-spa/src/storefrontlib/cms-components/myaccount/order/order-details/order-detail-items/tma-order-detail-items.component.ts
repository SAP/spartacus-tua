import { Component } from '@angular/core';
import { OrderDetailItemsComponent, OrderDetailsService, PromotionService } from '@spartacus/storefront';

@Component({
  selector: 'cx-order-details-items',
  templateUrl: './tma-order-detail-items.component.html',
})
export class TmaOrderDetailItemsComponent extends OrderDetailItemsComponent {

  constructor(
    orderDetailsService: OrderDetailsService,
    promotionService?: PromotionService
  ) {
    super(orderDetailsService, promotionService);
  }
}
