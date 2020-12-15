import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmfEndpointsService } from '../../services';
import { ConverterService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { Tmf } from '../../tmf-models';
import { GeographicAddress } from '../../../model';
import { GEOGRAPHIC_ADDRESS_NORMALIZER } from '../../../geographic-address/connectors';
import { GeographicAddressAdapter } from '../../../geographic-address/store/adapters';

@Injectable({
  providedIn: 'root',
})
export class TmfGeographicAddressAdapter implements GeographicAddressAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}

  createGeographicAddress(
    baseSiteId: string,
    geographicAddress: GeographicAddress
  ): Observable<GeographicAddress> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const queryParameters = Array();
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['relatedParty.id'] = geographicAddress.relatedParty.id;

    const url = this.tmfEndpointsService.getUrl(
      'createGeographicAddress',
      [],
      queryParameters
    );

    return this.http
      .post<Tmf.TmfGeographicAddress>(url, geographicAddress, { headers })
      .pipe(this.converterService.pipeable(GEOGRAPHIC_ADDRESS_NORMALIZER));
  }

  updateGeographicAddress(
    baseSiteId: string,
    geographicAddressId: string,
    geographicAddress: GeographicAddress
  ): Observable<GeographicAddress> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const queryParameters = Array();
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['relatedParty.id'] = geographicAddress.relatedParty.id;

    const url = this.tmfEndpointsService.getUrl(
      'updateGeographicAddress',
      [{ id: geographicAddressId }],
      queryParameters
    );

    return this.http
      .patch<Tmf.TmfGeographicAddress>(url, geographicAddress, { headers })
      .pipe(this.converterService.pipeable(GEOGRAPHIC_ADDRESS_NORMALIZER));
  }
}