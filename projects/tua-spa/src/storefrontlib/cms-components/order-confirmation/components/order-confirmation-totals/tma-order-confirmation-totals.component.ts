import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { OrderConfirmationTotalsComponent } from "@spartacus/checkout/components";
import { CheckoutFacade } from "@spartacus/checkout/root";
import { Observable } from 'rxjs';
import { TmaOrder } from '../../../../../core/model';

@Component({
  selector: 'cx-order-confirmation-totals',
  templateUrl: './tma-order-confirmation-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaOrderConfirmationTotalsComponent extends OrderConfirmationTotalsComponent {

  order$: Observable<TmaOrder>;

  constructor(protected checkoutService: CheckoutFacade) {
    super(checkoutService);
  }
}
