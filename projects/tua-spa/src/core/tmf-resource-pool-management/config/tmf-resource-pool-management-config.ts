import { SiteContextConfig } from '@spartacus/core';
import { TmfResourcePoolManagementEndpointMap } from '../tmf-resource-pool-management-models';

export abstract class TmfResourcePoolManagementConfig extends SiteContextConfig {
  backend?: {
    tmf_resource_pool_management?: {
      baseUrl?: string;
      prefix?: string;
      endpoints?: TmfResourcePoolManagementEndpointMap;
    };
  };
}
