import { TmaTmfShoppingCart } from '../../model';
import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';

export const TMA_TMF_CART_NORMALIZER = new InjectionToken<Converter<any, TmaTmfShoppingCart>>('TmaTmfCartNormalizer');
