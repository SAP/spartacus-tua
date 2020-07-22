import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {
  CheckoutService,
} from '@spartacus/core';
import { OrderConfirmationItemsComponent, PromotionService } from '@spartacus/storefront';

@Component({
  selector: 'cx-order-confirmation-items',
  templateUrl: './tma-order-confirmation-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaOrderConfirmationItemsComponent extends OrderConfirmationItemsComponent {

  constructor(
    protected checkoutService: CheckoutService,
    protected promotionService?: PromotionService
  ) {
    super(checkoutService, promotionService);
  }
}
