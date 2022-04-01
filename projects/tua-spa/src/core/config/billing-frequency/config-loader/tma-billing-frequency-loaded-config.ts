import { SiteContextConfig } from '@spartacus/core';
import { TmaBillingFrequencyMap } from '../../billing-frequency/config/tma-billing-frequency-config';

export interface TmaBillingFrequencyLoadedConfig extends SiteContextConfig {
  /**
   * List of billing frequency maps
   */
  billingFrequency?: TmaBillingFrequencyMap[],
}

declare module '@spartacus/core' {
  interface Config extends TmaBillingFrequencyLoadedConfig {}
}