import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { SubscriptionBaseDetail } from '../../../model';

export const SUBSCRIPTION_BASE_DETAIL_NORMALIZER = new InjectionToken<
  Converter<any, SubscriptionBaseDetail>
>('SubscriptionBaseDetailNormalizer');
