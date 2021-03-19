import { InjectionToken } from '@angular/core';
import { Converter, Cart } from '@spartacus/core';
import { TmaCartModification } from '../../model/tma-cart.model';

export const TMA_CART_MODIFICATION_NORMALIZER = new InjectionToken<Converter<any, TmaCartModification>>('TmaCartModificationNormalizer');

export const TMA_CART_NORMALIZER = new InjectionToken<Converter<any, Cart>>(
    'TmaCartNormalizer'
  );