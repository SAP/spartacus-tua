import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CartTotalsComponent } from '@spartacus/storefront';
import { ActiveCartService } from '@spartacus/core';
import {
  TmaCart,
  TmaMessage,
  TmaRootGroup,
  TmaValidationMessage,
  TmaValidationMessageType,
} from '../../../../core/model';
import { Observable } from 'rxjs';
import { AppointmentService } from '../../../../core/appointment/facade';

@Component({
  selector: 'cx-cart-totals',
  templateUrl: './tma-cart-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCartTotalsComponent
  extends CartTotalsComponent
  implements OnInit {
  hasAppointmentError$: Observable<boolean>;
  hasCancelledAppointment$: Observable<boolean>;

  constructor(
    protected activeCartService: ActiveCartService,
    protected appointmentService: AppointmentService
  ) {
    super(activeCartService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.hasAppointmentError$ = this.appointmentService.hasAppointmentError();
    this.hasCancelledAppointment$ = this.appointmentService.hasCancelledAppointment();
  }
  /**
   * Checks if cart has compatibility errors.
   *
   * @param cart - The cart
   * @return True if cart has compatibility errors, otherwise false
   */
  hasCompatibilityErrors(cart: TmaCart): boolean {
    return (
      this.hasCompatibilityErrorsOnCartLevel(cart) ||
      this.hasCompatibilityErrorsOnEntryLevel(cart)
    );
  }

  protected hasCompatibilityErrorsOnCartLevel(cart: TmaCart): boolean {
    return (
      cart.message &&
      !!cart.message.find(
        (validationMessage: TmaMessage) =>
          validationMessage.type === TmaValidationMessageType.COMPATIBILITY
      )
    );
  }

  protected hasCompatibilityErrorsOnEntryLevel(cart: TmaCart): boolean {
    return (
      cart.rootGroups &&
      !!cart.rootGroups.find((rootGroup: TmaRootGroup) => {
        if (
          rootGroup.validationMessages &&
          !!rootGroup.validationMessages.find(
            (validationMessage: TmaValidationMessage) =>
              validationMessage.code === TmaValidationMessageType.COMPATIBILITY
          )
        ) {
          return rootGroup;
        }
      })
    );
  }
}
