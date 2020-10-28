import { RoutesConfig, RoutingConfig } from '@spartacus/core';

export const defaultTmaStorefrontRoutesConfig: RoutesConfig = {
  product: {
    paths: ['product/:productCode']
  },
  category: {
    paths: ['c/:categoryCode'],
  },
  usageConsumption: {
    paths: ['my-account/subscription/subscription-base/:subscriptionId'],
    paramsMapping: { subscriptionId: 'code' },
  },
  subscriptions: {
    paths: ['/my-account/subscription'],
  },
  cgs: {
    paths: ['cgs/:bpoCode'],
    paramsMapping: { bpoCode: 'code' }
  }
};

export const defaultTmaRoutingConfig: RoutingConfig = {
  routing: {
    routes: defaultTmaStorefrontRoutesConfig
  }
};
