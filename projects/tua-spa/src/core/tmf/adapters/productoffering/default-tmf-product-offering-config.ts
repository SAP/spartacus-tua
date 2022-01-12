import { TmfConfig } from '../..';

export const defaultTmfProductOfferingConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getProductOffering: {
          baseUrl: 'https://localhost:9002',
          prefix: '/b2ctelcotmfwebservices',
          version: '/v3',
          endpoint: '/productOffering/${id}'
        }
      }
    }
  }
};
