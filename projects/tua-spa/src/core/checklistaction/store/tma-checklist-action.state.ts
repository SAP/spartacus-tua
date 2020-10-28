import { TmaProcessTypeEnum, TmaChecklistAction } from './../../model';

export const TMA_CHECKLIST_ACTION_FEATURE = 'checklist-action';
export const TMA_CHECKLIST_ACTION_DATA =
  '[Checklist-action] Checklist Action Data';

export interface TmaStateWithChecklistAction {
  [TMA_CHECKLIST_ACTION_FEATURE]: TmaChecklistActionsState;
}

export class TmaChecklistActionMap {
  productId: string;
  baseSiteId: string;
  processType?: TmaProcessTypeEnum;
  checklistAction: TmaChecklistAction[];
}

export interface TmaChecklistActionsState {
  checklistActionsMap: TmaChecklistActionMap[];
}
