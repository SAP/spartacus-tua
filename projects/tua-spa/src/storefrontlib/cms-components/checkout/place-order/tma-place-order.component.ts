import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CheckoutService, RoutingService } from '@spartacus/core';
import { PlaceOrderComponent } from '@spartacus/storefront';
import { AppointmentService } from '../../../../core/appointment/facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-place-order',
  templateUrl: './tma-place-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaPlaceOrderComponent
  extends PlaceOrderComponent
  implements OnInit {
  hasAppointmentError$: Observable<boolean>;
  hasCancelledAppointment$: Observable<boolean>;

  constructor(
    protected tmaCheckoutService: CheckoutService,
    protected tmaRoutingService: RoutingService,
    protected appointmentService: AppointmentService
  ) {
    super(tmaCheckoutService, tmaRoutingService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.hasAppointmentError$ = this.appointmentService.hasAppointmentError();
    this.hasCancelledAppointment$ = this.appointmentService.hasCancelledAppointment();
  }
}
