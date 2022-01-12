import { TmfConfig } from './tmf-config';

export const defaultTmfConfig: TmfConfig = {
  backend: {
    tmf: {
      baseUrl: 'https://localhost:9002',
      prefix: '/b2ctelcotmfwebservices',
      version: '/v2'
    },
    media: {},
  },
};
