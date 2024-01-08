import { Injectable, OnDestroy } from '@angular/core';
import * as GeographicAddressActions from '../store/actions/geographic-address.actions';
import { StateWithGeographicAddress } from '../store';
import { GeographicAddress } from '../../model';
import { Subject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as GeographicAddressSelectors from '../store/selectors/geographic-address.selector';

@Injectable()
export class GeographicAddressService implements OnDestroy {
  protected destroyed$ = new Subject();

  constructor(protected store: Store<StateWithGeographicAddress>) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * This method creates the geographic address.
   *
   * @param baseSiteId The id of the baseSite
   * @param geographicAddress The geographic address to be create
   */
  createGeographicAddress(
    baseSiteId: string,
    geographicAddress: GeographicAddress
  ): void {
    this.store.dispatch(
      new GeographicAddressActions.CreateGeographicAddress({
        baseSiteId: baseSiteId,
        geographicAddress: geographicAddress,
      })
    );
  }

  /**
   * This method updates the geographic address.
   *
   * @param baseSiteId The id of the baseSite
   * @param geographicAddressId The id of the geographic address to be update
   * @param geographicAddress The geographic address to be update
   */
  updateGeographicAddress(
    baseSiteId: string,
    geographicAddressId: string,
    geographicAddress: GeographicAddress
  ): void {
    this.store.dispatch(
      new GeographicAddressActions.UpdateGeographicAddress({
        baseSiteId: baseSiteId,
        geographicAddressId: geographicAddressId,
        geographicAddress: geographicAddress,
      })
    );
  }

  /**
   * This method retrives the selected installation address.
   *
   * @returns selected installation address as {@link Observable} of {@link GeographicAddress}
   */
  getSelectedInstallationAddress(): Observable<GeographicAddress> {
    return this.store.select(
      GeographicAddressSelectors.getSelectedInstallationGeographicAddress
    );
  }

  /**
   * This method determines if geographic address has error.
   *
   * @returns true if geographic address has error
   */
  hasGeographicAddressError(): Observable<boolean> {
    return this.store.select(
      GeographicAddressSelectors.getSelectedGeographicAddressError
    );
  }

  /**
   * This method clears the geographic address state.
   */
  clearCreatedGeographicAddressState(): void {
    this.store.dispatch(
      new GeographicAddressActions.ClearCreatedGeographicAddress()
    );
  }

  /**
   * This method clears the geographic address error.
   */
  clearGeographicAddressError(): void {
    this.store.dispatch(
      new GeographicAddressActions.ClearGeographicAddressError()
    );
  }
}
