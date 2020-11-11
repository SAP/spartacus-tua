import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaChecklistAction } from '../../model';

/**
 * Converter constant for converting {@link any} into {@link TmaChecklistAction}
 */
export const TMA_CHECKLIST_ACTION_NORMALIZER = new InjectionToken<Converter<any, TmaChecklistAction>>('TmaChecklistActionNormalizer');
