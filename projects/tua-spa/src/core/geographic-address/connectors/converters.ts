import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { GeographicAddress } from '../../model';

export const GEOGRAPHIC_ADDRESS_NORMALIZER = new InjectionToken<
  Converter<any, GeographicAddress>
>('GeographicAddressNormalizer');
