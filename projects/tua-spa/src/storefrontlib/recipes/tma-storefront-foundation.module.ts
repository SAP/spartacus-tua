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
  TmaProductSpecificationForViewDetailsConfigModule,
  TmaProductModule,
  TmaChecklistActionModule,
  AppointmentModule,
  SearchTimeSlotModule,
  JourneyChecklistConfigModule,
  GeographicAddressModule,
  RecommendationModule,
  ReservationModule,
  AvailabilityCheckModule,
  QueryServiceQualificationModule,
  DeliveryModeConfigModule
} from '../../core';
import { TmaTmfCartModule } from '../../core/tmf-cart';
import { SubscriptionModule } from '../../core/subscription/subscription.module';
import { TmaGlobalMessageModule } from '../../core/global-message/tma-global-message.module';
import { TmaCheckoutModule } from '../../core/checkout/tma-checkout.module';

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
    TmaProductModule.forRoot()
  ],
  exports: [],
  providers: []
})
export class TmaStorefrontFoundationModule {
}
