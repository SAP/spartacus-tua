import { ResourceRef } from '../../model';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as AvailabilityCheckActions from '../store/actions/availability-check.action';
import { Store, select } from '@ngrx/store';
import * as AvailabilityCheckSelectors from '../store/selectors';
import { StateWithAvailabilityCheck } from '../store';

@Injectable()
export class AvailabilityCheckService implements OnDestroy {
  protected destroyed$ = new Subject();

  constructor(protected store: Store<StateWithAvailabilityCheck>) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * This method is used to get list of available resources of the given logical resource type.
   *
   * @param capacityDemandAmount
   *          The amount of capacity that is planned to be consumed or has been consumed
   * @param  type
   *           Type of Logical Resource
   * @return
   *           List of Available Resources
   */
  getResourceCheckAvailability(
    capacityDemandAmount: number,
    type: string
  ): Observable<ResourceRef[]> {
    this.loadResources(capacityDemandAmount, type);
    return this.store.pipe(
      select(AvailabilityCheckSelectors.getLogicalResourceForType, {
        capacityDemandAmount,
        type
      })
    );
  }

  /**
   * This method is used to load the resources.
   *
   * @param capacityDemandAmount
   *          The amount of capacity that is planned to be consumed or has been consumed
   * @param type
   *           Type of Logical Resource
   */
  loadResources(capacityDemandAmount: number, type: string): void {
    this.store.dispatch(
      new AvailabilityCheckActions.LoadAvailabilityCheck({
        capacityDemandAmount,
        type
      })
    );
  }

  /**
   * This method is used to set the logical resource selected by user.
   *
   * @param resource
   *          The ResourceRef that is selected
   */
  setSelectedLogicalResource(resource: ResourceRef): void {
    this.store.dispatch(
      new AvailabilityCheckActions.SelectedLogicalResourceSuccess({
        resource
      })
    );
  }

  /**
   * Get the selected logical resource.
   *
   * @return
   *          selected logical resource as {@link Observable}
   */
  getSelectedLogicalResource(): Observable<ResourceRef> {
    return this.store
      .select(AvailabilityCheckSelectors.getSelectedLogicalResource);
  }

  /**
   * This method is used to determine if any error is there in fetching the availability check details.
   *
   * @return
   *        the error message indicating error occurred in fetching the availability check details of type  string {@link Observable}
   */
  getAvailabilityCheckError(): Observable<string> {
    return this.store.pipe(
      select(AvailabilityCheckSelectors.getAvailabilityCheckError)
    );
  }

  /**
   * Clear the AvailabilityCheck state.
   */
  clearAvailabilityCheckState(): void {
    this.store.dispatch(
      new AvailabilityCheckActions.ClearAvailabilityCheckState()
    );
  }

  /**
   * Clear the AvailabilityCheck error.
   */
  clearAvailabilityCheckError(): void {
    this.store.dispatch(
      new AvailabilityCheckActions.ClearAvailabilityCheckError()
    );
  }

  /**
   * Clear the selected logical Resource state.
   */
  clearSelectedLogicalResourceState(): void {
    this.store.dispatch(
      new AvailabilityCheckActions.ClearSelectedLogicalResourceState()
    );
  }

}
