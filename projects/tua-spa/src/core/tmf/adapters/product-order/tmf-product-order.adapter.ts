import { Injectable } from '@angular/core';
import { TmaProductOrderAdapter } from '../../../product-order/store/adapters';
import { Observable } from 'rxjs';
import { TmaPaginatedProductOrder, TmaProductOrder } from '../../../model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { TmfEndpointsService } from '../../services';
import { ConverterService, SearchConfig } from '@spartacus/core';
import { map } from 'rxjs/operators';
import { Tmf } from '../..';
import { TMA_PAGINATED_ORDER_NORMALIZER, TMA_PRODUCT_ORDER_NORMALIZER } from '../../../product-order';

@Injectable({
  providedIn: 'root'
})
export class TmfProductOrderAdapter implements TmaProductOrderAdapter {

  constructor(
    protected tmfEndpointsService: TmfEndpointsService,
    protected http: HttpClient,
    protected converterService: ConverterService
  ) {
  }

  getProductOrders(approverId: string, baseSiteId: string, searchConfig?: SearchConfig): Observable<TmaPaginatedProductOrder> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const queryParameters = Array();
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['relatedParty.id'] = approverId;

    if (searchConfig) {
      queryParameters['limit'] = searchConfig.pageSize;
      queryParameters['offset'] = searchConfig.pageSize * searchConfig.currentPage;
    }

    const url = this.tmfEndpointsService.getUrl(
      'getProductOrders',
      {},
      queryParameters
    );

    return this.http
      .get<Tmf.TmfPaginatedProductOrder>(url, { observe: 'response', headers: headers })
      .pipe(
        map((res: HttpResponse<any>) => {
          return {
            orders: res.body,
            totalCount: parseInt(res.headers.get('X-Total-Count'), 10)
          };
        }),
        this.converterService.pipeable(TMA_PAGINATED_ORDER_NORMALIZER)
      );
  }

  updateOrder(baseSiteId: string, orderId: string, order: TmaProductOrder): Observable<TmaProductOrder> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const queryParameters = Array();
    queryParameters['baseSiteId'] = baseSiteId;

    const url = this.tmfEndpointsService.getUrl(
      'updateOrder',
      { id: orderId },
      queryParameters
    );

    return this.http
      .patch<Tmf.TmfProductOrder>(url, order, { headers })
      .pipe(this.converterService.pipeable(TMA_PRODUCT_ORDER_NORMALIZER));
  }
}
