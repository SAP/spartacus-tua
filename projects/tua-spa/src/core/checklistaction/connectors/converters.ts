import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaChecklistAction } from '../../model';

export const TMA_CHECKLIST_ACTION_NORMALIZER = new InjectionToken<
  Converter<any, TmaChecklistAction>
>('TmaChecklistActionNormalizer');