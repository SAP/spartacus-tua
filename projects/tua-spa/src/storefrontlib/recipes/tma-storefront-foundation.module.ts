import { NgModule } from '@angular/core';
import { TmaAuthModule } from '../../core/auth';
import { TmaRoutingModule } from '../cms-structure/routing';
import {
  ProductOfferingModule,
  TmaBillingFrequencyConfigModule,
  TmaCartModule,
  TmaConsumptionConfigModule,
  TmaPremiseDetailModule,
  TmaProductSpecificationAverageCostModule,
  TmaProductSpecificationForViewDetailsConfigModule
} from '../../core';
import { TmaTmfCartModule } from '../../core/tmf-cart';
import { SubscriptionModule } from '../../core/subscription/subscription.module';
import {
  TmaChecklistActionModule,
  AppointmentModule,
  SearchTimeSlotModule,
  JourneyChecklistConfigModule,
  RecommendationModule,
  ReservationModule,
  AvailabilityCheckModule
} from '../../core';
import { TmaGlobalMessageModule } from '../../core/global-message/tma-global-message.module';
import { GeographicAddressModule } from '../../core/geographic-address';

@NgModule({
  imports: [
    TmaAuthModule.forRoot(),
    TmaRoutingModule.forRoot(),
    TmaBillingFrequencyConfigModule.forRoot(),
    TmaProductSpecificationAverageCostModule.forRoot(),
    TmaProductSpecificationForViewDetailsConfigModule.forRoot(),
    TmaPremiseDetailModule.forRoot(),
    TmaTmfCartModule.forRoot(),
    SubscriptionModule,
    TmaChecklistActionModule.forRoot(),
    AppointmentModule.forRoot(),
    SearchTimeSlotModule.forRoot(),
    JourneyChecklistConfigModule.forRoot(),
    GeographicAddressModule.forRoot(),
    ReservationModule.forRoot(),
    AvailabilityCheckModule.forRoot(),
    RecommendationModule.forRoot(),
    TmaGlobalMessageModule.forRoot(),
    TmaConsumptionConfigModule.forRoot(),
    TmaCartModule.forRoot(),
    ProductOfferingModule.forRoot()
  ],
  exports: [],
  providers: []
})
export class TmaStorefrontFoundationModule {
}
