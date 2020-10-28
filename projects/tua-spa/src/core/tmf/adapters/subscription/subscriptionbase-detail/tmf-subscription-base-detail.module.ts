import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { defaultTmfSubscriptionBaseDetailConfig } from './default-tmf-subscription-base-detail-config';
import { TmfSubscriptionBaseDetailAdapter } from './tmf-subscription-base-detail.adapter';
import { TmfSubscriptionBaseDetailNormalizer } from './converters';
import { SUBSCRIPTION_BASE_DETAIL_NORMALIZER } from '../../../../subscription/subscriptionbase-detail/connectors';
import { SubscriptionBaseDetailAdapter } from '../../../../subscription/subscriptionbase-detail/store/adapters';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfSubscriptionBaseDetailConfig),
  ],
  providers: [
    {
      provide: SubscriptionBaseDetailAdapter,
      useClass: TmfSubscriptionBaseDetailAdapter,
    },
    {
      provide: SUBSCRIPTION_BASE_DETAIL_NORMALIZER,
      useExisting: TmfSubscriptionBaseDetailNormalizer,
      multi: true,
    },
  ],
})
export class TmfSubscriptionBaseDetailModule {}
