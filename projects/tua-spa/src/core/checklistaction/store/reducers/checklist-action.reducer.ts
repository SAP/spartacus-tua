import { TmaChecklistActionType, TmaChecklistActionTypes } from '../actions/tma-checklist-action.action';
import { TmaChecklistActionMap, TmaChecklistActionsState } from '../tma-checklist-action.state';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';

const initialState: TmaChecklistActionMap[] = [];

/**
 * Reducer for checklist action related actions
 *
 * @param state - The current state of the store
 * @param action - The action executed
 * @return List of {@link TmaChecklistActionMap}
 */
export function checklistActionReducer(
  state = initialState,
  action: TmaChecklistActionType
): TmaChecklistActionMap[] {
  switch (action.type) {
    case TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS_SUCCESS: {
      if (!state.find(checklistActionState =>
        checklistActionState.productId === action.payload.productCode && checklistActionState.baseSiteId === action.payload.baseSiteId && checklistActionState.processType === action.payload.processType)) {
        state = state.concat({
          checklistAction: action.payload.checklistAction,
          productId: action.payload.productCode,
          baseSiteId: action.payload.baseSiteId,
          processType: action.payload.processType
        });
      }
      return state;
    }
  }
  return state;
}

export function getReducers(): ActionReducerMap<TmaChecklistActionsState> {
  return {
    checklistActionsMap: checklistActionReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<TmaChecklistActionsState>> = new InjectionToken<ActionReducerMap<TmaChecklistActionsState>>('checklistActionReducer');

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};

export const metaReducers: MetaReducer<any>[] = [];
