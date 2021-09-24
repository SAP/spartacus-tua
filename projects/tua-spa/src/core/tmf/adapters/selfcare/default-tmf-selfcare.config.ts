import { TmfConfig } from '../..';

export const defaultTmfSelfcareConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getSelfcareSubscriptions: {
          baseUrl: 'https://localhost:9002',
          prefix: '/subscribedproducttmfwebservices',
          version: '/v1',
          endpoint: '/product'
        },
        getSelfcareBillingAccounts: {
          baseUrl: 'https://localhost:9002',
          prefix: '/billingaccounttmfwebservices',
          version: '/v1',
          endpoint: '/billingAccount'
        }
      }
    }
  }
};
