import { Injectable } from '@angular/core';
import { TmaBillingFrequencyLoadedConfig } from './tma-billing-frequency-loaded-config';

@Injectable({ providedIn: 'root' })
export class TmaBillingFrequencyLoadedConfigConverter {

  fromBillingFrequencyConfig(billingFrequencyConfig: TmaBillingFrequencyLoadedConfig): TmaBillingFrequencyLoadedConfig {
    return {
      billingFrequency: billingFrequencyConfig.billingFrequency
    };
  }
}
