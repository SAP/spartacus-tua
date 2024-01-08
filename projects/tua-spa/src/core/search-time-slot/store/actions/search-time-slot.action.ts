import { StateUtils } from '@spartacus/core';
import { SEARCH_TIME_SLOT_DATA } from '../search-time-slot.state';

export enum SearchTimeSlotActionTypes {
  LOAD_SEARCH_TIME_SLOT = '[Search-TimeSlot] Load SearchTimeSlot',
  LOAD_SEARCH_TIME_SLOT_SUCCESS = '[Search-TimeSlot Load SearchTimeSlot Success',
  LOAD_SEARCH_TIME_SLOT_FAIL = '[Search-TimeSlot] Load SearchTimeSlot Fail',
  SELECTED_TIME_SLOT_SUCCESS = '[Search-TimeSlot] Selected TimeSlot Success',
}

export class LoadSearchTimeSlot extends StateUtils.LoaderLoadAction {
  readonly type = SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT;

  constructor(public payload: any) {
    super(SEARCH_TIME_SLOT_DATA);
  }
}

export class LoadSearchTimeSlotSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT_SUCCESS;

  constructor(public payload: any) {
    super(SEARCH_TIME_SLOT_DATA);
  }
}

export class LoadSearchTimeSlotFail extends StateUtils.LoaderFailAction {
  readonly type = SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT_FAIL;

  constructor(public payload: any) {
    super(SEARCH_TIME_SLOT_DATA);
  }
}

export class SelectedTimeSlotSucess {
  readonly type = SearchTimeSlotActionTypes.SELECTED_TIME_SLOT_SUCCESS;
  constructor(public payload: any) {}
}

export type SearchTimeSlotAction =
  | LoadSearchTimeSlot
  | LoadSearchTimeSlotSuccess
  | LoadSearchTimeSlotFail
  | SelectedTimeSlotSucess;
