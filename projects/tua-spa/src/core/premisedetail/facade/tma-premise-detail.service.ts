import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { TmaPremiseDetail, TmaTechnicalResources } from '../../model';
import { TmaPremiseDetailState, TmaStateWithPremiseDetail } from '../store';
import * as TmaPremiseDetailAction from '../store/actions/tma-premise-details.actions';
import * as TmaPremiseDetailSelector from '../store/selectors/tma-premise-detail.selector';

@Injectable({
  providedIn: 'root'
})
export class TmaPremiseDetailService {
  
  protected destroyed$ = new Subject();

  constructor(
    protected store: Store<TmaStateWithPremiseDetail>
  ) {
  }

  /**
   * Validates the provided premise details
   * 
   * @param premiseDetail - The premise details 
   * @return A {@link TmaTechnicalResource} as an {@link Observable}
   */
  validatePremiseDetails(premiseDetail: TmaPremiseDetail): Observable<TmaTechnicalResources> {
    this.store.select(TmaPremiseDetailSelector.getAllPremiseDetailStates)
      .pipe(
        takeUntil(this.destroyed$),
        tap((states: TmaPremiseDetailState[]) => {
            if (!states.find((state: TmaPremiseDetailState) => TmaPremiseDetail.equals(state.premiseDetail, premiseDetail))) {
              this.store.dispatch(new TmaPremiseDetailAction.ValidatePremiseDetail({
                premiseDetail: premiseDetail
              }));
            }
          }
        ), filter((states: TmaPremiseDetailState[]) => states != null)
      ).subscribe();

    return this.store.select(TmaPremiseDetailSelector.getTechnicalResources, { premiseDetail: premiseDetail });
  }
}
