import { TmaProcessTypeEnum } from '../../model';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as TmaChecklistAction from '../store/actions/tma-checklist-action.action';
import * as TmaChecklistActionModel from '../../model/tma-checklist-action.model';
import { Store, select } from '@ngrx/store';
import { TmaStateWithChecklistAction } from '../store';
import * as TmaChecklistActionSelectors from '../store/selectors/tma-checklist-action.selector';
import { takeUntil, tap } from 'rxjs/operators';
import { BaseSiteService } from '@spartacus/core';

@Injectable()
export class TmaChecklistActionService implements OnDestroy {
  
  protected activeBaseSite: string;
  
  protected destroyed$ = new Subject();

  /**
   *
   * @deprecated Since 2.0
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
   * This method is used to retrive checklist actions for defined product and process type
   * @param baseSiteId  The base site Id
   * @param productCode The product code
   * @param processType? The process type to find the checklist actions
   * @returns TmaChecklistActionModel.TmaChecklistAction[] The applicable checkist actions
   */
  getChecklistActionForProductCode(
    baseSiteId: string,
    productCode: string,
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistActionModel.TmaChecklistAction[]> {
    return this.store.pipe(
      select(TmaChecklistActionSelectors.getChecklistActionForProductCode, {
        productCode,
        baseSiteId,
        processType,
      }),
      tap((checklistActions: TmaChecklistActionModel.TmaChecklistAction[]) => {
        if (
          checklistActions === undefined ||
          Object.keys(checklistActions).length === 0
        ) {
          this.store.dispatch(
            new TmaChecklistAction.LoadChecklistActions({
              baseSiteId,
              productCode,
              processType,
            })
          );
        }
      })
    );
  }

  /**
   * Retrives the checklist actions for multiple product offerings based on process type
   *
   * @param baseSiteId  The base site Id
   * @param productOfferingCodes The list of product offering codes
   * @param processType? The process type to find the checklist actions
   * @returns TmaChecklistActionModel.TmaChecklistAction[] The applicable checklist actions
   */
  getChecklistActionsFor(
    baseSiteId: string,
    productOfferingCodes: string[],
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistActionModel.TmaChecklistAction[]> {
    return this.store.pipe(
      select(TmaChecklistActionSelectors.getChecklistActionForPoCodes, {
        productOfferingCodes,
        baseSiteId,
        processType,
      }),
      tap((checklistActions: TmaChecklistActionModel.TmaChecklistAction[]) => {
        if (
          checklistActions === undefined ||
          Object.keys(checklistActions).length === 0
        ) {
          this.store.dispatch(
            new TmaChecklistAction.LoadChecklistActions({
              baseSiteId,
              productOfferingCodes,
              processType,
            })
          );
        }
      })
    );
  }
}
