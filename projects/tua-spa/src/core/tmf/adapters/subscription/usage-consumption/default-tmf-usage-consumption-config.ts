import { TmfConfig } from '../../..';

export const defaultTmfUsageConsumptionConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getUsageConsumptionReports: {
          endpoint: 'usageConsumptionReport'
        },
      },
    },
  },
};
