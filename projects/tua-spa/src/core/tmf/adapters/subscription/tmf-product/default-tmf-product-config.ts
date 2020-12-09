import { TmfConfig } from '../../..';

export const defaultTmfProductConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        tmfProductId: '/product/${id}',
      },
    },
  },
};
