import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Recommendation } from '../..';

export const RECOMMENDATION_NORMALIZER = new InjectionToken<
  Converter<any, Recommendation>
>('RecommendationNormalizer');
