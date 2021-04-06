import { InjectionToken } from '@angular/core';
import { Converter, ProductReference } from '@spartacus/core';

export const TMA_PRODUCT_REFERENCES_NORMALIZER = new InjectionToken<
  Converter<any, ProductReference[]>
>('TmaProductReferencesListNormalizer');