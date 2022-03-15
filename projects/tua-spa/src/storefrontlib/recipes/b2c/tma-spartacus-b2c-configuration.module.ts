import { NgModule } from '@angular/core';
import {
  CartConfig,
  OccConfig,
  provideConfig,
  SiteContextConfig
} from '@spartacus/core';
import {
  defaultCmsContentProviders, layoutConfig,
  mediaConfig,
  PWAModuleConfig
} from '@spartacus/storefront';
import { tmaB2cLayoutConfig } from './config/index';
import {
  DeliveryModeConfig,
  JourneyChecklistConfig,
  PremiseLookupConfig,
  TmfAppointmentConfig,
  TmfConfig,
  TmfQueryServiceQualificationConfig,
  TmfResourcePoolManagementConfig
} from '../../../core';

@NgModule({
  providers: [
    provideConfig(layoutConfig),
    provideConfig(mediaConfig),
    provideConfig(tmaB2cLayoutConfig),
    ...defaultCmsContentProviders,
    provideConfig(<SiteContextConfig>{
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],
        baseSite: ['telcospa', 'utilitiesspa', 'mediaspa'],
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
        },
      },
    }),
    provideConfig(<JourneyChecklistConfig>{
      journeyChecklistSteps: ['APPOINTMENT', 'MSISDN', 'INSTALLATION_ADDRESS'],
      msisdn_reservation: {
        msisdn_qty: 1,
        msisdn_capacity_amount_demand: 1,
        msisdn_applied_capacity_amount: 5,
        applied_capacity_amount_for_msisdn_reservation: 1,
      },
      appointment: {
        requested_number_of_timeslots: 5,
        end_date_of_timeslots: 3,
      },
    }),
    provideConfig(<DeliveryModeConfig>{
      deliveryMode: {
        default_delivery_mode: 'subscription-only-gross',
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
export class TmaSpartacusB2cConfigurationModule {}
