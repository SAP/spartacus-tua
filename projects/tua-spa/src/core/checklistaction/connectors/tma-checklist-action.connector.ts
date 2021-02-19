import { Injectable } from '@angular/core';
import { TmaChecklistActionAdapter } from '../store/adapters/tma-checklist-action-adapter';
import { Observable } from 'rxjs';
import { TmaChecklistAction } from '../../model/tma-checklist-action.model';

@Injectable({
  providedIn: 'root',
})
export class TmaChecklistActionConnector {
  constructor(protected adapter: TmaChecklistActionAdapter) {
  }

  public getChecklistActions(
    baseSiteId: string,
    productCode: string,
  ): Observable<TmaChecklistAction[]> {
    return this.adapter.getChecklistActions(baseSiteId, productCode);
  }
}
