import { TmaBillingFrequencyConfig } from './tma-billing-frequency-config';

export const defaultTmaBillingFrequencyConfig: TmaBillingFrequencyConfig = {
  billingFrequency: [
    {
      key: 'yearly',
      value: 12
    },
    {
      key: 'year',
      value: 12
    },
    {
      key: 'annually',
      value: 12
    },
    {
      key: 'annual',
      value: 12
    },
    {
      key: 'monthly',
      value: 1
    },
    {
      key: 'month',
      value: 1
    },
    {
      key: 'quarterly',
      value: 3
    },
    {
      key: 'quarter',
      value: 3
    }
  ]
};
