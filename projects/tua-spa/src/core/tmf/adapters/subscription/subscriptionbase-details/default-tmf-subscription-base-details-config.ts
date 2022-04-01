import { TmfConfig } from '../../..';

export const defaultTmfSubscriptionBaseDetailsConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getSubscriptionBase: {
          endpoint: 'subscriptionbase/${subscriberId}'
        },
      },
    },
  },
};
