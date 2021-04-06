import { TmfConfig } from '../../..';

export const defaultTmfProductConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getProduct: {
          baseUrl: 'https://localhost:9002',
          prefix: '/b2ctelcotmfwebservices',
          version: '/v3',
          endpoint: '/product/${id}'
        },
      },
    },
  },
};
