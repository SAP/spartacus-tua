import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseSiteService } from '@spartacus/core';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import * as TmaChecklistActionModel from '../../model/tma-checklist-action.model';
import { TmaChecklistActionMap, TmaStateWithChecklistAction } from '../store';
import * as TmaChecklistAction from '../store/actions/tma-checklist-action.action';
import * as TmaChecklistActionSelectors from '../store/selectors/tma-checklist-action.selector';
import { TmaProcessTypeEnum } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaChecklistActionService implements OnDestroy {

  protected activeBaseSite: string;

  protected destroyed$ = new Subject();

  /**
   *
   * @deprecated Since 1.1
   * Add baseSiteService
   */
  constructor(
    store: Store<TmaStateWithChecklistAction>
  );

  constructor(
    protected store: Store<TmaStateWithChecklistAction>,
    protected baseSiteService?: BaseSiteService
  ) {
    if (this.baseSiteService) {
      this.baseSiteService
        .getActive()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((baseSiteId: string) => (this.activeBaseSite = baseSiteId));
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns the checklist action for the provided base site id, product code and process type
   *
   * @param baseSiteId - The identifier of the base site
   * @param productCode - The identifier of the product
   * @param processType - The process type
   * @return List of {@link TmaChecklistActionModel.TmaChecklistAction} as an {@link Observable}
   */
  getChecklistActionForProductCode(baseSiteId: string, productCode: string, processType?: TmaProcessTypeEnum): Observable<TmaChecklistActionModel.TmaChecklistAction[]> {
    this.store.select(TmaChecklistActionSelectors.getAllChecklistActions)
      .pipe(
        tap((checklistActions: TmaChecklistActionMap[]) => {
          if (!checklistActions.find((checklistAction: TmaChecklistActionMap) => checklistAction.productId === productCode && checklistAction.baseSiteId === baseSiteId && checklistAction.processType === processType)) {
            this.store.dispatch(new TmaChecklistAction.LoadChecklistActions({
              baseSiteId,
              productCode,
              processType
            }));
          }
        }),
        filter((checklistActions: TmaChecklistActionMap[]) => checklistActions != null),
        takeUntil(this.destroyed$))
      .subscribe();

    return this.store.select(TmaChecklistActionSelectors.getChecklistActionForProductCode, { productCode, baseSiteId, processType });
  }
}
