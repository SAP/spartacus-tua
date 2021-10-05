import { CmsConfig } from '@spartacus/core';

export const defaultTmaB2bOrderApprovalConfig: CmsConfig = {
  featureModules: {
    organizationOrderApproval: {
      module: () => import('@spartacus/organization/order-approval').then(
        (m) => m.OrderApprovalModule
      )
    }
  }
};
