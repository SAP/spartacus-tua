import { RoutesConfig, RoutingConfig } from '@spartacus/core';

export const defaultTmaStorefrontRoutesConfig: RoutesConfig = {
  product: {
    paths: ['product/:productCode'],
  },
  category: {
    paths: ['c/:categoryCode'],
  }
};

export const defaultTmaRoutingConfig: RoutingConfig = {
  routing: {
    routes: defaultTmaStorefrontRoutesConfig,
  },
};
