import { NgModule } from '@angular/core';
import { TmaAuthModule } from '../../core/auth';
import { TmaRoutingModule } from '../cms-structure/routing';
import { TmaBillingFrequencyConfigModule } from '../../core/billing-frequency/tma-billing-frequency.module';
import { TmaTmfCartModule } from '../../core/tmf-cart';
import { SubscriptionModule } from '../../core/subscription/subscription.module';
import {
  TmaChecklistActionModule,
  AppointmentModule,
  SearchTimeSlotModule,
} from '../../core';

@NgModule({
  imports: [
    TmaAuthModule.forRoot(),
    TmaRoutingModule.forRoot(),
    TmaBillingFrequencyConfigModule.forRoot(),
    TmaTmfCartModule.forRoot(),
    SubscriptionModule,
    TmaChecklistActionModule.forRoot(),
    AppointmentModule.forRoot(),
    SearchTimeSlotModule.forRoot(),
  ],
  exports: [],
  providers: [],
})
export class TmaStorefrontFoundationModule {}
