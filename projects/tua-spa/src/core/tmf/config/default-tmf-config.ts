/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmfConfig } from './tmf-config';

export const defaultTmfConfig: TmfConfig = {
  backend: {
    tmf: {
      baseUrl: 'https://localhost:9002',
      prefix: '/b2ctelcotmfwebservices/v2/',
    },
    media: {},
  },
};
