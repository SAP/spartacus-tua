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
    paths: ['cgs/:bpoCode/:process'],
    paramsMapping: { bpoCode: 'code', process: 'process' }
  },
  subscriptionDetail: {
    paths: ['my-account/subscription/subscriptionDetail/:subscriptionId'],
    paramsMapping: { subscriptionId: 'code' }
  }
};

export const defaultTmaRoutingConfig: RoutingConfig = {
  routing: {
    routes: defaultTmaStorefrontRoutesConfig
  }
};
