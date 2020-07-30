/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmaChecklistAction } from '../../model/tma-checklist-action.model';

export const TMA_CHECKLIST_ACTION_FEATURE = 'checklist-action';
export const TMA_CHECKLIST_ACTION_DATA = '[Checklist-action] Checklist Action Data';

export interface TmaStateWithChecklistAction {
  [TMA_CHECKLIST_ACTION_FEATURE]: TmaChecklistActionsState;
}

export class TmaChecklistActionMap {
  productId: string;
  baseSiteId: string;
  checklistAction: TmaChecklistAction[];
}

export interface TmaChecklistActionsState {
  checklistActionsMap: TmaChecklistActionMap[];
}
