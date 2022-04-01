import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckoutStepService, ReviewSubmitComponent } from "@spartacus/checkout/components";
import { CheckoutCostCenterFacade, CheckoutDeliveryFacade, CheckoutPaymentFacade, PaymentTypeFacade } from "@spartacus/checkout/root";
import {
  ActiveCartService,
  TranslationService,
  UserAddressService,
  UserCostCenterService
} from '@spartacus/core';

@Component({
  selector: 'cx-review-submit',
  templateUrl: './tma-review-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaReviewSubmitComponent extends ReviewSubmitComponent {

  constructor(
    protected checkoutDeliveryFacade: CheckoutDeliveryFacade,
    protected checkoutPaymentFacade: CheckoutPaymentFacade,
    protected userAddressService: UserAddressService,
    protected activeCartService: ActiveCartService,
    protected translation: TranslationService,
    protected checkoutStepService: CheckoutStepService,
    protected paymentTypeFacade: PaymentTypeFacade,
    protected checkoutCostCenterFacade: CheckoutCostCenterFacade,
    protected userCostCenterService: UserCostCenterService
  ) {
    super(checkoutDeliveryFacade, checkoutPaymentFacade, userAddressService, activeCartService, translation, checkoutStepService, paymentTypeFacade, checkoutCostCenterFacade, userCostCenterService);
  }
}
