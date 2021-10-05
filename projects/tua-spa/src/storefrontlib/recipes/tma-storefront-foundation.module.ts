import { NgModule } from '@angular/core';
import {
  AppointmentModule,
  AvailabilityCheckModule,
  DeliveryModeConfigModule,
  GeographicAddressModule,
  JourneyChecklistConfigModule,
  ProductOfferingModule,
  QueryServiceQualificationModule,
  RecommendationModule,
  ReservationModule,
  SearchTimeSlotModule,
  TmaBillingFrequencyConfigModule,
  TmaCartModule,
  TmaChecklistActionModule,
  TmaConsumptionConfigModule,
  TmaPremiseDetailModule,
  TmaProductModule,
  TmaProductSpecificationAverageCostModule,
  TmaProductSpecificationForViewDetailsConfigModule
} from '../../core';
import { TmaAuthModule } from '../../core/auth';
import { TmaCheckoutModule } from '../../core/checkout/tma-checkout.module';
import { TmaGlobalMessageModule } from '../../core/global-message/tma-global-message.module';
import { SelfcareModule } from '../../core/selfcare/selfcare.module';
import { SubscriptionModule } from '../../core/subscription/subscription.module';
import { TmaTmfCartModule } from '../../core/tmf-cart';
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
    TmaCheckoutModule.forRoot(),
    DeliveryModeConfigModule.forRoot(),
    QueryServiceQualificationModule.forRoot(),
    ProductOfferingModule.forRoot(),
    TmaProductModule.forRoot(),
    SelfcareModule.forRoot()
  ],
  exports: [],
  providers: []
})
export class TmaStorefrontFoundationModule {}
