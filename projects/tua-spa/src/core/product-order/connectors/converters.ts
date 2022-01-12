import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaPaginatedProductOrder, TmaProductOrder } from '../../model';

/**
 * Converter constant for converting {@link any} into {@link TmaPaginatedProductOrder}
 */
export const TMA_PAGINATED_ORDER_NORMALIZER = new InjectionToken<Converter<any, TmaPaginatedProductOrder>>('TmaPaginatedProductOrderNormalizer');

/**
 * Converter constant for converting {@link any} into {@link TmaProductOrder}
 */
export const TMA_PRODUCT_ORDER_NORMALIZER = new InjectionToken<Converter<any, TmaProductOrder>>('TmaProductOrderNormalizer');
