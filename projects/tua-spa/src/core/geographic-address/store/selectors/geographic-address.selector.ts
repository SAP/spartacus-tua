import {
  MemoizedSelector,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import {
  GeographicAddressState,
  GEOGRAPHIC_ADDRESS_FEATURE,
  StateWithGeographicAddress,
} from '../geographic-address-state';
import { GeographicAddress } from '../../../model';

export const getGeographicAddressFeatureState: MemoizedSelector<
  StateWithGeographicAddress,
  GeographicAddressState
> = createFeatureSelector<GeographicAddressState>(GEOGRAPHIC_ADDRESS_FEATURE);

export const getSelectedInstallationGeographicAddress: MemoizedSelector<
  StateWithGeographicAddress,
  GeographicAddress
> = createSelector(
  getGeographicAddressFeatureState,
  (state: GeographicAddressState) => { return state.installationAddress;
  }
);

export const getSelectedGeographicAddressError: MemoizedSelector<
  StateWithGeographicAddress,
  boolean
> = createSelector(
  getGeographicAddressFeatureState,
  (state: GeographicAddressState) => state.error.isGeographicAddressError
);
