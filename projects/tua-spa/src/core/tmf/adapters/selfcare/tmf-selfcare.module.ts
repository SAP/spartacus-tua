import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigModule } from '@spartacus/core';
import {
  SelfcareAdapter,
  SELFCARE_BILLING_ACCOUNTS_NORMALIZER,
  SELFCARE_SUBSCRIPTIONS_NORMALIZER
} from '../../../selfcare';
import {
  TmfSelfcareBillingAccountsNormalizer,
  TmfSelfcareSubscriptionsNormalizer
} from './converters';
import { defaultTmfSelfcareConfig } from './default-tmf-selfcare.config';
import { TmfSelfcareAdapter } from './tmf-selfcare.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfSelfcareConfig)
  ],
  providers: [
    {
      provide: SelfcareAdapter,
      useClass: TmfSelfcareAdapter
    },
    {
      provide: SELFCARE_SUBSCRIPTIONS_NORMALIZER,
      useExisting: TmfSelfcareSubscriptionsNormalizer,
      multi: true
    },
    {
      provide: SELFCARE_BILLING_ACCOUNTS_NORMALIZER,
      useExisting: TmfSelfcareBillingAccountsNormalizer,
      multi: true
    }
  ]
})
export class TmfSelfcareModule {}
