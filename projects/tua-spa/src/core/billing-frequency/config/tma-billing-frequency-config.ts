export interface TmaBillingFrequencyMap {
  key: string,
  value: number,
}

export abstract class TmaBillingFrequencyConfig {
  billingFrequency?: TmaBillingFrequencyMap[];
}
