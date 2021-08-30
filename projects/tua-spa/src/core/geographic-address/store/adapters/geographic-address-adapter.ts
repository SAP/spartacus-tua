import { Observable } from 'rxjs';
import { GeographicAddress } from '../../../model';

export abstract class GeographicAddressAdapter {
  /**
   * creates the geographic address
   *
   * @param baseSiteId The identifier of the base site
   * @param geographicAddress The GeographicAddress
   * @return The created geographic address as {@link Observable} of {@link GeographicAddress}
   */
  abstract createGeographicAddress(
    baseSiteId: string,
    geographicAddress: GeographicAddress
  ): Observable<GeographicAddress>;

  /**
   * Updates the geographic address
   *
   * @param baseSiteId The identifier of the base site
   * @param geographicAddressId The id of the geographic address to be update
   * @param geographicAddress The GeographicAddress
   * @return The updated geographic address as {@link Observable} of {@link GeographicAddress}
   */
  abstract updateGeographicAddress(
    baseSiteId: string,
    geographicAddressId: string,
    geographicAddress: GeographicAddress
  ): Observable<GeographicAddress>;
}