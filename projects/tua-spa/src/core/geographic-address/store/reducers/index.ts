import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';
import {
  geographicAddressErrorReducer,
  selectedInstallationAddressReducer,
} from './geographic-address.reducer';
import { GeographicAddressState } from '../geographic-address-state';

export function getReducers(): ActionReducerMap<GeographicAddressState> {
  return {
    installationAddress: selectedInstallationAddressReducer,
    error: geographicAddressErrorReducer,
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<
  GeographicAddressState
>> = new InjectionToken<ActionReducerMap<GeographicAddressState>>(
  'GeographicAddressReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
