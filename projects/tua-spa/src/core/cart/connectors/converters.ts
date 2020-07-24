import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaCartModification } from '../../model/tma-cart.model';

export const TMA_CART_MODIFICATION_NORMALIZER = new InjectionToken<Converter<any, TmaCartModification>>('TmaCartModificationNormalizer');
