import { SiteContextConfig } from '@spartacus/core';
import { TmfQueryServiceQualificationEndpointMap } from '..';

export abstract class TmfQueryServiceQualificationConfig extends SiteContextConfig {
  backend?: {
    tmf_query_service_qualification?: {
      baseUrl?: string;
      prefix?: string;
      endpoints?: TmfQueryServiceQualificationEndpointMap;
    };
  };
}
