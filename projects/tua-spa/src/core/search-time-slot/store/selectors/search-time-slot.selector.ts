import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import {
  SearchTimeSlotState,
  StateWithSearchTimeSlot,
  SEARCH_TIME_SLOT_FEATURE,
} from '../search-time-slot.state';
import { SearchTimeSlot, TimeSlot } from '../../../model';
import { StateUtils } from '@spartacus/core';

export const getTmfSearchTimeSlotFeatureState: MemoizedSelector<
  StateWithSearchTimeSlot,
  SearchTimeSlotState
> = createFeatureSelector<SearchTimeSlotState>(SEARCH_TIME_SLOT_FEATURE);

export const getSearchTimeSlotsState: MemoizedSelector<
  StateWithSearchTimeSlot,
  StateUtils.LoaderState<SearchTimeSlot>
> = createSelector(
  getTmfSearchTimeSlotFeatureState,
  (state: SearchTimeSlotState) => state.searchTimeSlots
);

export const getAllSearchTimeSlots: MemoizedSelector<
  StateWithSearchTimeSlot,
  SearchTimeSlot
> = createSelector(
  getSearchTimeSlotsState,
  StateUtils.loaderValueSelector
);

export const getSelectedTimeSlots: MemoizedSelector<
  StateWithSearchTimeSlot,
  TimeSlot
> = createSelector(
  getTmfSearchTimeSlotFeatureState,
  (state: SearchTimeSlotState) => state.selectedTimeSlot
);
