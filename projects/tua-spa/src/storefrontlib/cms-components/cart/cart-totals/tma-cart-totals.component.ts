import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CartTotalsComponent } from '@spartacus/storefront';
import { CartService } from '@spartacus/core';

@Component({
  selector: 'cx-cart-totals',
  templateUrl: './tma-cart-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCartTotalsComponent extends CartTotalsComponent {

  constructor(
    protected cartService: CartService
  ) {
    super(cartService)
  }
}
