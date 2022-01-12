import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ActiveCartService,
  CheckoutCostCenterService,
  CheckoutDeliveryService,
  CheckoutPaymentService,
  PaymentTypeService,
  TranslationService,
  UserAddressService,
  UserCostCenterService,
} from '@spartacus/core';
import { CheckoutConfigService, CheckoutStepService, PromotionService, ReviewSubmitComponent } from '@spartacus/storefront';

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
    protected activeCartService: ActiveCartService,
    protected translation: TranslationService,
    protected promotionService: PromotionService,
    protected checkoutStepService: CheckoutStepService,
    protected paymentTypeService: PaymentTypeService,
    protected checkoutCostCenterService: CheckoutCostCenterService,
    protected userCostCenterService: UserCostCenterService
  ) {
    super(checkoutDeliveryService, checkoutPaymentService, userAddressService, activeCartService, translation, promotionService, checkoutStepService, paymentTypeService, checkoutCostCenterService, userCostCenterService);
  }
}
