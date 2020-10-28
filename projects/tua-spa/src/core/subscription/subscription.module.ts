import { NgModule } from '@angular/core';
import { SubscriptionBaseModule } from './subscriptionbase';
import { SubscriptionBaseDetailModule } from './subscriptionbase-detail';
import { UsageConsumptionModule } from './usage-consumption';
import { TmfProductModule } from './tmf-product';

@NgModule({
  imports: [
    SubscriptionBaseModule,
    SubscriptionBaseDetailModule,
    TmfProductModule,
    UsageConsumptionModule,
  ],
})
export class SubscriptionModule {}
