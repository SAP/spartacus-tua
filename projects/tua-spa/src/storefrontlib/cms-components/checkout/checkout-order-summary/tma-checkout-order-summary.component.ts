import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '@spartacus/core';
import { CheckoutOrderSummaryComponent } from '@spartacus/storefront';
import { TmaCart } from '../../../../core/model';

@Component({
  selector: 'cx-checkout-order-summary',
  templateUrl: './tma-checkout-order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCheckoutOrderSummaryComponent extends CheckoutOrderSummaryComponent {

  cart$: Observable<TmaCart>;

  constructor(protected cartService: CartService) {
    super(cartService);
  }
}
