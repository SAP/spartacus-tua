import { NgModule } from '@angular/core';
import {
  CartConfig,
  OccConfig,
  provideConfig,
  SiteContextConfig
} from '@spartacus/core';
import {
  defaultB2bCheckoutConfig,
  defaultB2bOccConfig
} from '@spartacus/setup';
import {
  defaultCmsContentProviders,
  layoutConfig,
  mediaConfig,
  PWAModuleConfig
} from '@spartacus/storefront';
import {
  PremiseLookupConfig,
  TmfAppointmentConfig,
  TmfConfig,
  TmfQueryServiceQualificationConfig,
  TmfResourcePoolManagementConfig
} from '../../../core';
import {
  defaultTmaB2bLayoutConfig,
  defaultTmaB2bOrderApprovalConfig,
  defaultTmaB2bOrganizationAdministrationConfig
} from './config/index';

@NgModule({
  providers: [
    provideConfig(layoutConfig),
    provideConfig(mediaConfig),
    provideConfig(defaultTmaB2bLayoutConfig),
    provideConfig(defaultTmaB2bOrderApprovalConfig),
    provideConfig(defaultTmaB2bOrganizationAdministrationConfig),
    provideConfig(defaultB2bOccConfig),
    provideConfig(defaultB2bCheckoutConfig),
    ...defaultCmsContentProviders,
    provideConfig(<SiteContextConfig>{
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],
        baseSite: ['b2btelcospa'],
        currency: ['USD'],
        language: ['en'],
      },
    }),
    provideConfig(<PWAModuleConfig>{
      pwa: {
        enabled: true,
        addToHomeScreen: true,
      },
    }),
    provideConfig(<CartConfig>{
      cart: {
        selectiveCart: {
          enabled: false,
        },
      },
    }),
    provideConfig(<TmfConfig>{
      backend: {
        tmf: {
          baseUrl: 'https://localhost:9002',
          prefix: '/b2ctelcotmfwebservices',
          version: '/v2',
          endpoints: {
            getProduct: {
              baseUrl: 'https://localhost:9002',
              prefix: '/b2ctelcotmfwebservices',
              version: '/v3',
              endpoint: '/product/${id}',
            },
            getProductOffering: {
              baseUrl: 'https://localhost:9002',
              prefix: '/b2ctelcotmfwebservices',
              version: '/v3',
              endpoint: '/productOffering/${id}',
            },
          },
        },
      },
    }),
    provideConfig(<OccConfig>{
      backend: {
        occ: {
          baseUrl: 'https://localhost:9002',
          prefix: '/occ/v2/',
          endpoints: {
            setDeliveryAddress: {
              default:'users/${userId}/carts/${cartId}/addresses/delivery'
            },
            addEntries: {
              default: 'orgUsers/${userId}/carts/${cartId}/entries?quantity=${quantity}&code=${code}'
            },
            placeOrder: {
              default: 'users/${userId}/orders'
            }
          }
        },
      },
    }),
    provideConfig(<TmfResourcePoolManagementConfig>{
      backend: {
        tmf_resource_pool_management: {
          baseUrl: 'http://localhost:8081',
          prefix: '/tmf-api',
        },
      },
    }),
    provideConfig(<TmfAppointmentConfig>{
      backend: {
        tmf_appointment: {
          baseUrl: 'http://localhost:8082',
          prefix: '/tmf-api',
        },
      },
    }),
    provideConfig(<PremiseLookupConfig>{
      backend: {
        premiseLookup: {
          baseUrl: 'http://localhost:9003',
          prefix: '/premise/v1/',
        },
      },
    }),
    provideConfig(<TmfQueryServiceQualificationConfig>{
      backend: {
        tmf_query_service_qualification: {
          baseUrl: 'http://localhost:8080',
          prefix: '/tmf-api',
        },
      },
    }),
  ],
})
export class TmaSpartacusB2bConfigurationModule { }
