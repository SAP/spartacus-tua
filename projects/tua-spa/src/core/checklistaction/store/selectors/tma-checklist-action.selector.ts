import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';
import {
  TMA_CHECKLIST_ACTION_FEATURE,
  TmaChecklistActionMap,
  TmaChecklistActionsState,
  TmaStateWithChecklistAction,
} from '../tma-checklist-action.state';
import { TmaChecklistAction } from '../../../model';

/**
 * Returns the checklist action state.
 *
 * @return A {@link TmaChecklistActionsState}
 */
export const getTmaChecklistActionsFeatureState: MemoizedSelector<TmaStateWithChecklistAction, TmaChecklistActionsState> =
  createFeatureSelector<TmaChecklistActionsState>(TMA_CHECKLIST_ACTION_FEATURE);

/**
* Returns the checklist actions from the store.
*
* @return List of {@link TmaChecklistActionMap}
*/
export const getAllChecklistActions: MemoizedSelector<TmaStateWithChecklistAction, TmaChecklistActionMap[]> =
  createSelector(getTmaChecklistActionsFeatureState, (state: TmaChecklistActionsState) => state.checklistActionsMap);

/**
* Returns the checklist action for the provided product code current base site and process type from the store
* 
* @return List of {@link TmaChecklistAction}
*/
export const getChecklistActionForProductCode: MemoizedSelectorWithProps<TmaStateWithChecklistAction, any, TmaChecklistAction[]> =
  createSelector(getAllChecklistActions, (state: TmaChecklistActionMap[], props) => {
    const checklistAction: TmaChecklistActionMap = state ? state.find((ca: TmaChecklistActionMap) => ca.productId === props.productCode && ca.baseSiteId === props.baseSiteId && ca.processType === props.processType) : undefined;
    if (!!checklistAction) {
      return checklistAction.checklistAction;
    }
  });

