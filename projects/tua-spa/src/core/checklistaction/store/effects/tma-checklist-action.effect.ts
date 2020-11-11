import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as TmaChecklistActions from '../actions/tma-checklist-action.action';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TmaChecklistActionTypes } from '../actions/tma-checklist-action.action';
import { TmaChecklistActionConnector } from '../../connectors';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaChecklistAction } from '../../../model';
import { Action } from '@ngrx/store';


@Injectable()
export class TmaChecklistActionEffect {

  constructor(
    protected actions$: Actions,
    protected tmaChecklistActionConnector: TmaChecklistActionConnector
  ) {
  }

  /**
   * Effect for the checklist action related actions
   */
  @Effect()
  loadChecklistAction$: Observable<Action> = this.actions$.pipe(
    ofType(TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS),
    map((action: TmaChecklistActions.LoadChecklistActions) => action.payload),
    mergeMap(payload => {
      return this.tmaChecklistActionConnector.getChecklistActions(payload.baseSiteId, payload.productCode, payload.processType).pipe(
        map((checklistActions: TmaChecklistAction[]) => {
          return new TmaChecklistActions.LoadChecklistActionsSuccess({
            checklistAction: checklistActions,
            productCode: payload.productCode,
            baseSiteId: payload.baseSiteId,
            processType: payload.processType
          });
        }),
        catchError(error =>
          of(
            new TmaChecklistActions.LoadChecklistActionsFail(
              makeErrorSerializable(error))
          ))
      );
    })
  );
}
