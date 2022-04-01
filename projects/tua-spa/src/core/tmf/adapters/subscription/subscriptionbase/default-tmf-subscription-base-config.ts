import { TmfConfig } from '../../..';

export const defaultTmfSubscriptionBaseConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getSubscriptionBases: {
          endpoint: 'subscriptionBase'
        },
      },
    },
  },
};
