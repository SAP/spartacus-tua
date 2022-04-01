import { TmfConfig } from '../..';

export const defaultTmfSelfcareConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getSubscriptions: {
          baseUrl: 'https://localhost:9002',
          prefix: '/subscribedproducttmfwebservices',
          version: '/v1',
          endpoint: '/product'
        },
        getBillingAccounts: {
          baseUrl: 'https://localhost:9002',
          prefix: '/billingaccounttmfwebservices',
          version: '/v1',
          endpoint: '/billingAccount'
        },
        getBillingAgreements: {
          baseUrl: 'https://localhost:9002',
          prefix: '/agreementtmfwebservices',
          version: '/v1',
          endpoint: '/agreement'
        }
      }
    }
  }
};
