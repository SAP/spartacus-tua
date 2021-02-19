import {
  TmaChecklistActionType,
  TmaChecklistActionTypes
} from '../actions/tma-checklist-action.action';
import {
  TmaChecklistActionMap,
  TmaChecklistActionsState
} from '../tma-checklist-action.state';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';
import { TmaChecklistAction, TmaTmfProductOffering } from '../../../model';

const initialState: TmaChecklistActionMap[] = [];

export function checklistActionReducer(
  state = initialState,
  action: TmaChecklistActionType
): TmaChecklistActionMap[] {
  switch (action.type) {
    case TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS_SUCCESS: {
      if (action.payload.productCode) {
        if (
          !state.find(
            (checklistActionState: TmaChecklistActionMap) =>
              checklistActionState.productId === action.payload.productCode &&
              checklistActionState.baseSiteId === action.payload.baseSiteId &&
              checklistActionState.processType === action.payload.processType
          )
        ) {
          state = state.concat({
            checklistAction: action.payload.checklistActions,
            productId: action.payload.productCode,
            baseSiteId: action.payload.baseSiteId,
            processType: action.payload.processType
          });
        }
        return state;
      }

      if (!action.payload.productOfferingCodes) {
        return state;
      }

      action.payload.productOfferingCodes.forEach(
        (payloadProductOffering: string) => {
          if (
            !state.find(
              (checklistActionState: TmaChecklistActionMap) =>
                checklistActionState.productId === payloadProductOffering &&
                checklistActionState.baseSiteId ===
                action.payload.baseSiteId &&
                checklistActionState.processType ===
                action.payload.processType
            )
          ) {
            const checklists: TmaChecklistAction[] = [];
            if (action.payload.checklistActions.length !== 0) {
              action.payload.checklistActions.forEach(
                (checklistAction: TmaChecklistAction) => {
                  checklistAction.productOffering.forEach(
                    (productOffering: TmaTmfProductOffering) => {
                      const productOfferings: TmaTmfProductOffering[] = [];
                      if (payloadProductOffering === productOffering.id) {
                        productOfferings.push(productOffering);
                        const checklist: TmaChecklistAction = {
                          actionType: checklistAction.actionType,
                          productOffering: productOfferings
                        };
                        checklists.push(checklist);
                      }
                    }
                  );
                }
              );
            }
            state = state.concat({
              checklistAction: checklists,
              productId: payloadProductOffering,
              baseSiteId: action.payload.baseSiteId,
              processType: action.payload.processType
            });
          }
        }
      );
    }
      return state;
  }
  return state;
}

export function getReducers(): ActionReducerMap<TmaChecklistActionsState> {
  return {
    checklistActionsMap: checklistActionReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<TmaChecklistActionsState>> = new InjectionToken<ActionReducerMap<TmaChecklistActionsState>>(
  'checklistActionReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};

export const metaReducers: MetaReducer<any>[] = [];
