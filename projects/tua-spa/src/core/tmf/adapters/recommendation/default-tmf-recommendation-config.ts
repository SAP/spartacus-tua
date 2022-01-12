import { TmfConfig } from '../../config/tmf-config';

export const defaultTmfRecommendationConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getRecommendations: {
          endpoint: 'recommendation'
        }
      },
    },
  },
};
