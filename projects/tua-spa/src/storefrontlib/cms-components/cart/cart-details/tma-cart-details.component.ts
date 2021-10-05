import { CartDetailsComponent, PromotionService } from '@spartacus/storefront';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TmaCartService } from '../../../../core/cart/facade';
import {
  ActiveCartService,
  SelectiveCartService,
  AuthService,
  RoutingService
} from '@spartacus/core';
import { TmaValidationMessageType } from '../../../../core/model';

@Component({
  selector: 'cx-cart-details',
  templateUrl: './tma-cart-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartDetailsComponent extends CartDetailsComponent implements OnInit {

  constructor(
    activeCartService: ActiveCartService,
    promotionService: PromotionService,
    selectiveCartService: SelectiveCartService,
    authService: AuthService,
    routingService: RoutingService,
    protected tmaCartService: TmaCartService
  ) {
    super(
      activeCartService,
      promotionService,
      selectiveCartService,
      authService,
      routingService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  get validationMessageType(): typeof TmaValidationMessageType {
    return TmaValidationMessageType;
  }
}
