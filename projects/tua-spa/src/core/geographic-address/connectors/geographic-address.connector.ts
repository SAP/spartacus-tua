import { GeographicAddress } from '../../model';
import { Injectable } from '@angular/core';
import { GeographicAddressAdapter } from '../store/adapters';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeographicAddressConnector {
  constructor(protected adapter: GeographicAddressAdapter) {}

  /**
   * Creates the address for user.
   *
   * @param baseSiteId The identifier of the base site
   * @param geographicAddress The GeographicAddress
   * @return The created geographic address
   */
  public createGeographicAddress(
    baseSiteId: string,
    geographicAddress: GeographicAddress
  ): Observable<GeographicAddress> {
    return this.adapter.createGeographicAddress(baseSiteId, geographicAddress);
  }

  /**
   * Updates the address for user.
   *
   * @param baseSiteId The identifier of the base site
   * @param geographicAddressId The id of the geographic address to be update
   * @param geographicAddress The GeographicAddress
   * @return The updated geographic address
   */
  public updateGeographicAddress(
    baseSiteId: string,
    geographicAddressId: string,
    geographicAddress: GeographicAddress
  ): Observable<GeographicAddress> {
    return this.adapter.updateGeographicAddress(
      baseSiteId,
      geographicAddressId,
      geographicAddress
    );
  }
}
