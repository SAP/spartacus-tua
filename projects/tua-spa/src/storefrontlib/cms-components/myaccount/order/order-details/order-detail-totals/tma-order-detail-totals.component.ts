import { Component } from '@angular/core';
import { OrderDetailsService, OrderDetailTotalsComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaOrder } from '../../../../../../core/model';

@Component({
  selector: 'cx-order-details-totals',
  templateUrl: './tma-order-detail-totals.component.html',
})
export class TmaOrderDetailTotalsComponent extends OrderDetailTotalsComponent {

  order$: Observable<TmaOrder>;

  constructor(protected orderDetailsService: OrderDetailsService) {
    super(orderDetailsService);
  }
}
