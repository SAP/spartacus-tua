import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmfProduct } from '../../../model';

export const TMF_PRODUCT_NORMALIZER = new InjectionToken<
  Converter<any, TmfProduct>
>('TmfProductNormalizer');
