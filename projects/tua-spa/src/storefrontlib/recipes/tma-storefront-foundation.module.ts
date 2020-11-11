import { NgModule } from '@angular/core';
import {
  AppointmentModule,
  AvailabilityCheckModule,
  JourneyChecklistConfigModule,
  ReservationModule,
  SearchTimeSlotModule,
  TmaAuthModule,
  TmaBillingFrequencyConfigModule,
  TmaCartModule,
  TmaChecklistActionModule,
  TmaConsumptionConfigModule,
  TmaPremiseDetailModule,
  TmaProductSpecificationAverageCostModule,
  TmaProductSpecificationForViewDetailsConfigModule,
  TmaTmfCartModule
} from '../../core';
import { SubscriptionModule } from '../../core/subscription/subscription.module';
import { TmaRoutingModule } from '../cms-structure/routing';

@NgModule({
  imports: [
    TmaAuthModule.forRoot(),
    TmaRoutingModule.forRoot(),
    TmaBillingFrequencyConfigModule.forRoot(),
    TmaProductSpecificationAverageCostModule.forRoot(),
    TmaProductSpecificationForViewDetailsConfigModule.forRoot(),
    TmaPremiseDetailModule.forRoot(),
    TmaTmfCartModule.forRoot(),
    TmaChecklistActionModule.forRoot(),
    TmaCartModule.forRoot(),
    SubscriptionModule,
    AppointmentModule.forRoot(),
    SearchTimeSlotModule.forRoot(),
    TmaConsumptionConfigModule.forRoot(),
    ReservationModule.forRoot(),
    AvailabilityCheckModule.forRoot(),
    JourneyChecklistConfigModule.forRoot(),
  ],
  exports: [],
  providers: []
})
export class TmaStorefrontFoundationModule {}
