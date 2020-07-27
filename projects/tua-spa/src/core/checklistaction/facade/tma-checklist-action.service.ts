import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as TmaChecklistAction from '../store/actions/tma-checklist-action.action';
import * as TmaChecklistActionModel from '../../model/tma-checklist-action.model';
import { Store } from '@ngrx/store';
import { TmaStateWithChecklistAction } from '../store';
import * as TmaChecklistActionSelectors from '../store/selectors/tma-checklist-action.selector';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class TmaChecklistActionService implements OnDestroy {

  protected destroyed$ = new Subject();

  constructor(
    protected store: Store<TmaStateWithChecklistAction>
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getChecklistActionForProductCode(baseSiteId: string, productCode: string): Observable<TmaChecklistActionModel.TmaChecklistAction[]> {
    this.store.select(TmaChecklistActionSelectors.getAllChecklistActions)
      .pipe(
        tap(checklistActions => {
          if (!checklistActions.find(checklistAction =>
            checklistAction.productId === productCode && checklistAction.baseSiteId === baseSiteId)) {
            this.store.dispatch(new TmaChecklistAction.LoadChecklistActions({
              baseSiteId,
              productCode
            }));
          }
        }),
        filter(checklistActions => checklistActions != null),
        takeUntil(this.destroyed$))
      .subscribe();

    return this.store
      .select(TmaChecklistActionSelectors.getChecklistActionForProductCode, { productCode, baseSiteId });
  }

}
