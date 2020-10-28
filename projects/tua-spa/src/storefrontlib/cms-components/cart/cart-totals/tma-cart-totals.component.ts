import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CartTotalsComponent } from '@spartacus/storefront';
import { CartService } from '@spartacus/core';
import {
  TmaCart,
  TmaMessage,
  TmaRootGroup,
  TmaValidationMessage,
  TmaValidationMessageType
} from '../../../../core/model';
import { Observable } from 'rxjs';
import { AppointmentService } from '../../../../core/appointment/facade';
import { LogicalResourceReservationService } from '../../../../core/reservation/facade';

@Component({
  selector: 'cx-cart-totals',
  templateUrl: './tma-cart-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartTotalsComponent
  extends CartTotalsComponent
  implements OnInit {
  hasAppointmentError$: Observable<boolean>;
  hasCancelledAppointment$: Observable<boolean>;
  hasReservationError$: Observable<boolean>;
  hasCancelledReservations$: Observable<boolean>;

  constructor(
    protected cartService: CartService,
    protected appointmentService?: AppointmentService,
    protected logicalResourceReservationService?: LogicalResourceReservationService
  ) {
    super(cartService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.hasAppointmentError$ = this.appointmentService.hasAppointmentError();
    this.hasCancelledAppointment$ = this.appointmentService.hasCancelledAppointment();
    this.hasReservationError$ = this.logicalResourceReservationService.hasReservationError();
    this.hasCancelledReservations$ = this.logicalResourceReservationService.hasCancelledReservations();
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
