import { Address } from '@spartacus/core';

export interface TmaAddress extends Address {
  installationAddress?: boolean;
}
