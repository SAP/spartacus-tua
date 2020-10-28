import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TmfSubscriptionBaseModule } from './subscriptionbase';
import { TmfSubscriptionBaseDetailModule } from './subscriptionbase-detail';
import { TmfUsageConsumptionModule } from './usage-consumption';
import { TmfProductAdapterModule } from './tmf-product';

@NgModule({
  imports: [
    CommonModule,
    TmfSubscriptionBaseModule,
    TmfSubscriptionBaseDetailModule,
    TmfProductAdapterModule,
    TmfUsageConsumptionModule,
  ],
  providers: [],
})
export class TmfSubscriptionModule {}
