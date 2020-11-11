import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CartService,
  CheckoutDeliveryService,
  CheckoutPaymentService,
  TranslationService,
  UserAddressService,
} from '@spartacus/core';
import { CheckoutConfigService, PromotionService, ReviewSubmitComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-review-submit',
  templateUrl: './tma-review-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaReviewSubmitComponent extends ReviewSubmitComponent {

  constructor(
    protected checkoutDeliveryService: CheckoutDeliveryService,
    protected checkoutPaymentService: CheckoutPaymentService,
    protected userAddressService: UserAddressService,
    protected cartService: CartService,
    protected translation: TranslationService,
    protected checkoutConfigService: CheckoutConfigService,
    protected promotionService: PromotionService
  ) {
    super(checkoutDeliveryService, checkoutPaymentService, userAddressService, cartService, translation, checkoutConfigService, promotionService);
  }
}
