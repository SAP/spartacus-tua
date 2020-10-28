import { TmfResourcePoolManagementConfig } from './tmf-resource-pool-management-config';

export function tmaConfigValidator(config: TmfResourcePoolManagementConfig) {
  if (
    config.backend === undefined ||
    config.backend.tmf_resource_pool_management === undefined ||
    config.backend.tmf_resource_pool_management.baseUrl === undefined
  ) {
    return 'Please configure backend.tmf_resource_pool_management.baseUrl before using storefront library!';
  }
}
