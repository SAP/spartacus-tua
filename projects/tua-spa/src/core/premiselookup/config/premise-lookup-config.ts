import { SiteContextConfig } from '@spartacus/core';
import { PremiseLookupEndpoints } from '../models';

export abstract class PremiseLookupConfig extends SiteContextConfig {
  backend?: {
    premiseLookup?: {
      baseUrl?: string;
      prefix?: string;
      endpoints?: PremiseLookupEndpoints;
    };
  };
}
