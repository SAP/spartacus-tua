import { TmfResourcePoolManagementConfig } from '../../config';

export const defaultTmfAvailabilityCheckConfig: TmfResourcePoolManagementConfig = {
  backend: {
    tmf_resource_pool_management: {
      endpoints: {
        availabilityCheck: {
          endpoint: 'resourcePoolManagement/availabilityCheck'
        }
      }
    }
  }
};
