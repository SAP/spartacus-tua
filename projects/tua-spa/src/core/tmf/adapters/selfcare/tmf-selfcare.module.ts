import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigModule } from '@spartacus/core';
import {
  BILLING_ACCOUNTS_NORMALIZER, BILLING_AGREEMENTS_NORMALIZER, SelfcareAdapter, SUBSCRIPTIONS_NORMALIZER
} from '../../../selfcare';
import {
  TmfSelfcareBillingAccountsNormalizer,
  TmfSelfcareBillingAgreementsNormalizer,
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
      provide: SUBSCRIPTIONS_NORMALIZER,
      useExisting: TmfSelfcareSubscriptionsNormalizer,
      multi: true
    },
    {
      provide: BILLING_ACCOUNTS_NORMALIZER,
      useExisting: TmfSelfcareBillingAccountsNormalizer,
      multi: true
    },
    {
      provide: BILLING_AGREEMENTS_NORMALIZER,
      useExisting: TmfSelfcareBillingAgreementsNormalizer,
      multi: true
    }
  ]
})
export class TmfSelfcareModule {}
