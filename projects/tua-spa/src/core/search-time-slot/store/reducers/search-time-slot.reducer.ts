import {
  SearchTimeSlotAction,
  SearchTimeSlotActionTypes,
} from '../actions/search-time-slot.action';
import { SearchTimeSlot, TimeSlot } from '../../../model';

export const searchTimeSlotInitialState: SearchTimeSlot = {};
export const selectedTimeSlotInitialState: TimeSlot = {};

/**
 * Function to update the state with available time slots
 * @param state The state of the SearchTimeSlotState
 * @param action Dispatched action of {@link SearchTimeSlotAction}
 * @returns list of {@link SearchTimeSlot} of {@link SearchTimeSlotState}
 */
export function searchTimeSlotReducer(
  state = searchTimeSlotInitialState,
  action: SearchTimeSlotAction
): SearchTimeSlot {
  switch (action.type) {
    case SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT_SUCCESS: {
      return action.payload;
    }
  }
  return state;
}

/**
 * Function to update the state with selected time slot
 * @param state The state of the SearchTimeSlotState
 * @param action Dispatched action of {@link SearchTimeSlotAction}
 * @returns list of {@link TimeSlot} of {@link SearchTimeSlotState}
 */
export function selectedTimeSlotReducer(
  state = selectedTimeSlotInitialState,
  action: SearchTimeSlotAction
): TimeSlot {
  switch (action.type) {
    case SearchTimeSlotActionTypes.SELECTED_TIME_SLOT_SUCCESS: {
      return action.payload.timeSlot;
    }
  }
  return state;
}
