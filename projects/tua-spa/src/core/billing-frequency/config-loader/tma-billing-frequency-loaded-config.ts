import { TmaBillingFrequencyMap } from '../../billing-frequency/config/tma-billing-frequency-config';

export interface TmaBillingFrequencyLoadedConfig {
  /**
   * List of billing frequency maps
   */
  billingFrequency: TmaBillingFrequencyMap[],
}
