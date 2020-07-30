/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { RoutesConfig, RoutingConfig } from '@spartacus/core';

export const defaultTmaStorefrontRoutesConfig: RoutesConfig = {
  product: {
    paths: ['product/:productCode']
  },
  category: {
    paths: ['c/:categoryCode']
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
