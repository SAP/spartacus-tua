import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { SearchTimeSlot } from '../..';

export const SEARCH_TIME_SLOT_NORMALIZER = new InjectionToken<
  Converter<any, SearchTimeSlot>
>('SearchTimeSlotNormalizer');
