import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OccEndpointsService,
  OccCheckoutAdapter,
  CheckoutAdapter,
  ConverterService,
  Order,
  OCC_USER_ID_ANONYMOUS,
  InterceptorUtil,
  USE_CLIENT_TOKEN,
  Occ,
} from '@spartacus/core';
import { TMA_ORDER_NORMALIZER } from '../../../checkout/connectors';

const FULL_PARAMS = 'fields=FULL';
const ORDERS_ENDPOINT = '/orders';

@Injectable()
export class TmaOccCheckoutAdapter
  extends OccCheckoutAdapter
  implements CheckoutAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {
    super(http, occEndpoints, converter);
  }

   /**
   * Places an order for a given cart of the user.
   *
   * @param userId The identifier of the user
   * @param cartId The identifier of the cart
   * @return The order as {@link Observable} of {@link Order}
   */
  public placeOrder(userId: string, cartId: string): Observable<Order> {
    const url = this.getEndpoint(userId, ORDERS_ENDPOINT);
    const params = new HttpParams({
      fromString: 'cartId=' + cartId + '&' + FULL_PARAMS,
    });

    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    if (userId === OCC_USER_ID_ANONYMOUS) {
      headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    }

    return this.http
      .post<Occ.Order>(url, {}, { headers, params })
      .pipe(this.converter.pipeable(TMA_ORDER_NORMALIZER));
  }
}
