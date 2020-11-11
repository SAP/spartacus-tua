import { NgModule } from '@angular/core';
import { SubscriptionBaseListModule } from './subscriptionbase-list';
import { UsageConsumptionComponentModule } from './usage-consumption';
import { TmfProductComponentModule } from './tmf-product';

@NgModule({
  imports: [
    SubscriptionBaseListModule,
    TmfProductComponentModule,
    UsageConsumptionComponentModule,
  ],
})
export class SubscriptionComponentModule {}
