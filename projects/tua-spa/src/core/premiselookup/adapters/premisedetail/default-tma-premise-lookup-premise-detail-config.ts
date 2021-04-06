import { PremiseLookupConfig } from '../../config';

export const defaultTmaPremiseLookupPremiseDetailConfig: PremiseLookupConfig = {
  backend: {
    premiseLookup: {
      endpoints: {
        premiseValidation:
          'premiselookup'
      }
    }
  }
};
