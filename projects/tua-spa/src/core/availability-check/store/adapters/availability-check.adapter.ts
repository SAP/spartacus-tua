import { Observable } from 'rxjs';
import { ResourceCapacityDemand, AppliedCapacityAmount } from '../../../model';

export abstract class AvailabilityCheckAdapter {

  /**
   * Abstract method used to get the logical resources
   *
   * @param resourceCapacityDemand
   *           The resourceCapacityDemand to retrieve logical resources
   * @returns Observable<AppliedCapacityAmount>
   *          applied capacity amount
   */
  abstract getLogicalResources(
    resourceCapacityDemand: ResourceCapacityDemand
  ): Observable<AppliedCapacityAmount>;
}
