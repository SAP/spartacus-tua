import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CheckoutService, RoutingService } from '@spartacus/core';
import { PlaceOrderComponent } from '@spartacus/storefront';
import { AppointmentService } from '../../../../core/appointment/facade';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
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
    protected tmaCheckoutService: CheckoutService,
    protected tmaRoutingService: RoutingService,
    protected fb: FormBuilder,
    protected appointmentService: AppointmentService,
    protected logicalResourceReservationService?: LogicalResourceReservationService
  ) {
    super(tmaCheckoutService, tmaRoutingService, fb);
  }

  toggleTAndC(): void {
    this.tAndCToggler = !this.tAndCToggler;
  }
  placeOrder(): void {
    this.checkoutService.placeOrder();
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
