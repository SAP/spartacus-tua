import { PremiseLookupConfig } from './premise-lookup-config';

export const defaultPremiseLookupConfig: PremiseLookupConfig = {
  backend: {
    premiseLookup: {
      baseUrl: 'http://localhost:9003',
      prefix: '/premise/v1/'
    }
  }
};
