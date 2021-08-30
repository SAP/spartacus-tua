import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TmfSubscriptionBaseModule } from './subscriptionbase';
import { TmfSubscriptionBaseDetailsModule } from './subscriptionbase-details';
import { TmfUsageConsumptionModule } from './usage-consumption';
import { TmfProductAdapterModule } from './tmf-product';

@NgModule({
  imports: [
    CommonModule,
    TmfSubscriptionBaseModule,
    TmfSubscriptionBaseDetailsModule,
    TmfProductAdapterModule,
    TmfUsageConsumptionModule,
  ],
  providers: [],
})
export class TmfSubscriptionModule {}