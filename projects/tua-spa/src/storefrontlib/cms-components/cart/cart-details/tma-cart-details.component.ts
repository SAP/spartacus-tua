import { CartDetailsComponent, PromotionService } from '@spartacus/storefront';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TmaCartService } from '../../../../core/cart/facade';
import { AuthService, FeatureConfigService, RoutingService, SelectiveCartService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaCart, TmaValidationMessageType } from '../../../../core/model';

@Component({
  selector: 'cx-cart-details',
  templateUrl: './tma-cart-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartDetailsComponent extends CartDetailsComponent {

  cart$: Observable<TmaCart>;

  constructor(
    protected tmaCartService: TmaCartService,
    protected promotionService: PromotionService,
    protected selectiveCartService: SelectiveCartService,
    protected authenticationService: AuthService,
    protected routeService: RoutingService,
    protected featureConfigService: FeatureConfigService
  ) {
    super(tmaCartService, promotionService, selectiveCartService, authenticationService, routeService, featureConfigService);
  }

  get validationMessageType(): typeof TmaValidationMessageType {
    return TmaValidationMessageType;
  }
}
