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
