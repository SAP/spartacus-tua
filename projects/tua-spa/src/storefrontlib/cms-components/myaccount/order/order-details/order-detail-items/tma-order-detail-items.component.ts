import { Component } from '@angular/core';
import { Consignment, ConsignmentEntry } from '@spartacus/core';
import {
  OrderDetailItemsComponent,
  OrderDetailsService,
  PromotionService
} from '@spartacus/storefront';
import { TmaOrder, TmaOrderEntry } from '../../../../../../core';

@Component({
  selector: 'cx-order-details-items',
  templateUrl: './tma-order-detail-items.component.html'
})
export class TmaOrderDetailItemsComponent extends OrderDetailItemsComponent {
  constructor(
    orderDetailsService: OrderDetailsService,
    promotionService?: PromotionService
  ) {
    super(orderDetailsService, promotionService);
  }

  /**
   * Checks for product present inside the entries of an consignment.
   *
   * @param consigment as an {@link Consignment}
   *
   * @return true if there is entry having product otherwise false {@link boolean}
   */
  checkConsignmentFor(consigment: Consignment): boolean {
    let entry: ConsignmentEntry;
    if (consigment.entries) {
      entry = consigment.entries.find(
        (item: ConsignmentEntry) =>
          Object.keys(item.orderEntry.product).length === 0
      );
    }
    return entry === undefined ? true : false;
  }

  /**
   * Checks for product present inside the entries of an order.
   *
   * @param order as an {@link Order}
   *
   * @return true if there is entry having product otherwise false {@link boolean}
   */
  checkOrderFor(order: TmaOrder): boolean {
    let entry: TmaOrderEntry;
    if (order.unconsignedEntries) {
      entry = order.unconsignedEntries.find(
        (item: TmaOrderEntry) => Object.keys(item.product).length === 0
      );
    }
    return entry === undefined ? true : false;
  }
}
