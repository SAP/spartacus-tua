import { ChangeDetectionStrategy, Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CheckoutReplenishmentFormService, PlaceOrderComponent } from "@spartacus/checkout/components";
import { CheckoutFacade } from "@spartacus/checkout/root";
import { RoutingService } from '@spartacus/core';
import { LaunchDialogService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { AppointmentService } from '../../../../core/appointment/facade';
import { LogicalResourceReservationService } from '../../../../core/reservation/facade';

@Component({
  selector: 'cx-place-order',
  templateUrl: './tma-place-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPlaceOrderComponent extends PlaceOrderComponent implements OnInit {
  tAndCToggler = false;
  hasAppointmentError$: Observable<boolean>;
  hasCancelledAppointment$: Observable<boolean>;
  hasReservationError$: Observable<boolean>;
  hasCancelledReservations$: Observable<boolean>;

  constructor(
    protected checkoutFacade: CheckoutFacade,
    protected tmaRoutingService: RoutingService,
    protected fb: FormBuilder,
    protected checkoutReplenishmentFormService: CheckoutReplenishmentFormService,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected appointmentService: AppointmentService,
    protected logicalResourceReservationService?: LogicalResourceReservationService

  ) {
    super(checkoutFacade, tmaRoutingService, fb, checkoutReplenishmentFormService, launchDialogService, vcr);
  }

  toggleTAndC(): void {
    this.tAndCToggler = !this.tAndCToggler;
  }
  placeOrder(): void {
    this.checkoutService.placeOrder(this.checkoutSubmitForm.valid);
  }

  ngOnInit() {
    super.ngOnInit();
    this.hasAppointmentError$ = this.appointmentService.hasAppointmentError();
    this.hasCancelledAppointment$ = this.appointmentService.hasCancelledAppointment();
    this.hasReservationError$ = this.logicalResourceReservationService.hasReservationError();
    this.hasCancelledReservations$ = this.logicalResourceReservationService.hasCancelledReservations();
  }

  hasError(error: boolean): boolean {
    return error;
  }
}
