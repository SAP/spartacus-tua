/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthConfig } from '@spartacus/core';

export const defaultTmaAuthConfig: AuthConfig = {
  authentication: {
    client_id: 'mobile_android',
    client_secret: 'secret',
  },
  backend: {
    occ: {
      endpoints: {
        login: '/authorizationserver/oauth/token',
        revoke: '/authorizationserver/oauth/revoke',
      },
    },
  },
};
