import { TmfResourcePoolManagementConfig } from './tmf-resource-pool-management-config';

export const defaultResourceTmfConfig: TmfResourcePoolManagementConfig = {
  backend: {
    tmf_resource_pool_management: {
      baseUrl: 'http://localhost:8080',
      prefix: '/tmf-api'
    }
  }
};
