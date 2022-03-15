import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckoutOrderSummaryComponent } from "@spartacus/checkout/components";
import { ActiveCartService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaCart } from '../../../../core/model';

@Component({
  selector: 'cx-checkout-order-summary',
  templateUrl: './tma-checkout-order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCheckoutOrderSummaryComponent extends CheckoutOrderSummaryComponent {

  cart$: Observable<TmaCart>;

  constructor(
    protected activeCartService: ActiveCartService
  ) {
    super(activeCartService);
  }
}
