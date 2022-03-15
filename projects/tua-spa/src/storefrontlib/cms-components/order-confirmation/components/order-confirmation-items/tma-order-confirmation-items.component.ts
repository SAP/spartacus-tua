import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { OrderConfirmationItemsComponent } from "@spartacus/checkout/components";
import { CheckoutFacade } from "@spartacus/checkout/root";

@Component({
  selector: 'cx-order-confirmation-items',
  templateUrl: './tma-order-confirmation-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaOrderConfirmationItemsComponent extends OrderConfirmationItemsComponent {

  constructor(
    protected checkoutFacade: CheckoutFacade
  ) {
    super(checkoutFacade);
  }
}
