import { Injectable } from "@angular/core";
import { TmaChecklistAction, TmaChecklistActionType } from '../../model';

@Injectable({
    providedIn: 'root'
})
export class TmaChecklistActionTypeCheckService {
    /**
   * Check if the installation address action type is provided
   * 
   * @param checklistActionList - list of checklist actions
   * @param type - checklist action type
   * @return True if the checklist type is found in the checklist actions list, otherwise false
   */
  hasChecklistActionOfType(checklistActionList: TmaChecklistAction[], type: TmaChecklistActionType): boolean {
    return !!checklistActionList.find((checklistAction: TmaChecklistAction) => checklistAction.actionType === type);
  }
}