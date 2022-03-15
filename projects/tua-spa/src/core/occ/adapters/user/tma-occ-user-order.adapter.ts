import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OccUserOrderAdapter,
  UserOrderAdapter,
  OccEndpointsService,
  ConverterService,
  Order,
  OCC_USER_ID_ANONYMOUS,
  InterceptorUtil,
  USE_CLIENT_TOKEN,
  Occ
} from '@spartacus/core';
import { TMA_ORDER_NORMALIZER } from '../../../checkout/connectors';

@Injectable()
export class TmaOccUserOrderAdapter
  extends OccUserOrderAdapter
  implements UserOrderAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {
    super(http, occEndpoints, converter);
  }

   /**
   * Retrieves an order for a given order id of the user.
   *
   * @param userId The identifier of the user
   * @param orderCode The identifier of the order
   * @return The order as {@link Observable} of {@link Order}
   */
  public load(userId: string, orderCode: string): Observable<Order> {
     const url = this.occEndpoints.buildUrl('orderDetail', {
       urlParams: {
         userId,
         orderId: orderCode
       }
     });

    let headers = new HttpHeaders();
    if (userId === OCC_USER_ID_ANONYMOUS) {
      headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    }
    return this.http
      .get<Occ.Order>(url, { headers })
      .pipe(this.converter.pipeable(TMA_ORDER_NORMALIZER));
  }
}
