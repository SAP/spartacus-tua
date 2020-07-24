import { StateLoaderActions } from '@spartacus/core';
import { TMA_CHECKLIST_ACTION_DATA } from '../tma-checklist-action.state';

export enum TmaChecklistActionTypes {
  LOAD_CHECKLIST_ACTIONS = '[Checklist-action] Load Checklist Actions',
  LOAD_CHECKLIST_ACTIONS_SUCCESS = '[Checklist-action] Load Checklist Actions Success',
  LOAD_CHECKLIST_ACTIONS_FAIL = '[Checklist-action] Load Checklist Actions Fail'
}

export class LoadChecklistActions extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS;

  constructor(public payload: any) {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export class LoadChecklistActionsSuccess extends StateLoaderActions.LoaderSuccessAction {
  readonly type = TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS_SUCCESS;

  constructor(public payload: any) {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export class LoadChecklistActionsFail extends StateLoaderActions.LoaderFailAction {
  readonly type = TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS_FAIL;

  constructor(public payload: any) {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export type TmaChecklistActionType =
  | LoadChecklistActions
  | LoadChecklistActionsSuccess
  | LoadChecklistActionsFail;
