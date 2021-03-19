import { InjectionToken } from '@angular/core';
import { Converter, Order } from '@spartacus/core';

export const TMA_ORDER_NORMALIZER = new InjectionToken<Converter<any, Order>>(
  'TmaOrderNormalizer'
);
