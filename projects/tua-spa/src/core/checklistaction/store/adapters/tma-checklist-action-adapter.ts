import { Observable } from 'rxjs';
import { TmaProcessTypeEnum, TmaChecklistAction } from '../../../model';

export abstract class TmaChecklistActionAdapter {
  /**
   * Abstract method used to get the checklist actions
   * @param baseSiteId The identifier of the base site
   * @param productId The identifier of the product
   * @param processType The identifier of the processType
   */
  abstract getChecklistActions(
    baseSiteId: string,
    productId: string,
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistAction[]>;
}
