import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import * as fromTmaSearchTimeSlotReducers from './search-time-slot.reducer';
import {
  SearchTimeSlotState,
  SEARCH_TIME_SLOT_DATA,
} from '../search-time-slot.state';
import { SearchTimeSlot } from '../../..';
import { loaderReducer } from '@spartacus/core';

export function getReducers(): ActionReducerMap<SearchTimeSlotState> {
  return {
    searchTimeSlots: loaderReducer<SearchTimeSlot>(
      SEARCH_TIME_SLOT_DATA,
      fromTmaSearchTimeSlotReducers.searchTimeSlotReducer
    ),
    selectedTimeSlot: fromTmaSearchTimeSlotReducers.selectedTimeSlotReducer,
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<
  SearchTimeSlotState
>> = new InjectionToken<ActionReducerMap<SearchTimeSlotState>>(
  'SearchTimeSlotReducers'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
