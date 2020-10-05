import { TmfConfig } from '../../..';

export const defaultTmfSubscriptionBaseDetailConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        subscriptionBaseId: 'subscriptionbase/${subscriberId}',
      },
    },
  },
};
