import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ConverterService,
  InterceptorUtil,
  RoutingService,
  USE_CLIENT_TOKEN
} from '@spartacus/core';
import { Observable } from 'rxjs';
import {
  TmaSelfcareBillingAccounts,
  TmaSelfcareSubscriptions,
  TmaSubscribedProductsInventory
} from '../../../model';
import {
  SelfcareAdapter,
  SELFCARE_BILLING_ACCOUNTS_NORMALIZER,
  SELFCARE_SUBSCRIBED_PRODUCT_NORMALIZER,
  SELFCARE_SUBSCRIPTIONS_NORMALIZER
} from '../../../selfcare';
import { TmfEndpointsService } from '../../services';
import { Tmf } from '../../tmf-models';

@Injectable({
  providedIn: 'root'
})
export class TmfSelfcareAdapter implements SelfcareAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService,
    protected routingService: RoutingService
  ) {}

  getSelfcareSubscriptions(): Observable<TmaSubscribedProductsInventory> {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const url = this.tmfEndpointsService.getUrl('getSelfcareSubscriptions', {});

    return this.http
      .get<Tmf.TmfSubscribedProductsInventory>(url, { headers })
      .pipe(this.converterService.pipeable(SELFCARE_SUBSCRIPTIONS_NORMALIZER));
  }

  getSubscribedProduct(
    productId: string
  ): Observable<TmaSelfcareSubscriptions> {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const url = this.tmfEndpointsService.getUrl('getSelfcareSubscriptions', {});

    return this.http
      .get<Tmf.TmfSelfcareSubscriptions>(`${url}/${productId}`, { headers })
      .pipe(
        this.converterService.pipeable(SELFCARE_SUBSCRIBED_PRODUCT_NORMALIZER)
      );
  }

  getSelfcareBillingAccounts(): Observable<TmaSelfcareBillingAccounts[]> {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const url = this.tmfEndpointsService.getUrl(
      'getSelfcareBillingAccounts',
      {}
    );

    return this.http
      .get<Tmf.TmfSelfcareBillingAccounts[]>(url, { headers })
      .pipe(
        this.converterService.pipeableMany(SELFCARE_BILLING_ACCOUNTS_NORMALIZER)
      );
  }
}
