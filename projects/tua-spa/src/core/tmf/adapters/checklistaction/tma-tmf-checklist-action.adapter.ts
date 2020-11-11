import { TmaProcessTypeEnum } from './../../../model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TmaChecklistAction } from '../../../model';
import { TmaChecklistActionAdapter } from '../../../checklistaction/store/adapters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmfEndpointsService } from '../../services';
import { ConverterService } from '@spartacus/core';
import { Tmf } from '../../tmf-models';
import { TMA_CHECKLIST_ACTION_NORMALIZER } from '../../../checklistaction/connectors';

@Injectable({
  providedIn: 'root',
})
export class TmaTmfChecklistActionAdapter implements TmaChecklistActionAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}

  /**
   * Returns the checklist action for the provided product and base site.
   *
   * @param baseSiteId - The identifier of the base site
   * @param productId - The identifier of the product
   * @return List of {@link TmaChecklistAction} as an {@link Observable}
   */
  getChecklistActions(
    baseSiteId: string,
    productId: string,
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistAction[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const queryParameters = Array();
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['processType.id'] = TmaProcessTypeEnum[processType];
    queryParameters['productOffering.id'] = productId;


    const url: string = this.tmfEndpointsService.getUrl('checklistAction', [], queryParameters);

    return this.http
      .get<Tmf.TmaChecklistAction[]>(url, { headers })
      .pipe(
        this.converterService.pipeableMany(TMA_CHECKLIST_ACTION_NORMALIZER)
      );
  }
}
