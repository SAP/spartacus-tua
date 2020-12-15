import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, concatMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { GeographicAddressActionTypes } from '../actions/geographic-address.actions';
import { Action } from '@ngrx/store';
import { GeographicAddressAction } from '../actions/index';
import { GeographicAddress } from '../../../model';
import { GeographicAddressConnector } from '../../connectors';

@Injectable()
export class GeographicAddressEffects {
  constructor(
    protected actions$: Actions,
    protected geographicAddressConnector: GeographicAddressConnector
  ) {}

  @Effect()
  createGeographicAddress$: Observable<Action> = this.actions$.pipe(
    ofType(GeographicAddressActionTypes.CREATE_GEOGRAPHIC_ADDRESS),
    map(
      (action: GeographicAddressAction.CreateGeographicAddress) =>
        action.payload
    ),
    concatMap((payload: any) => {
      return this.geographicAddressConnector
        .createGeographicAddress(payload.baseSiteId, payload.geographicAddress)
        .pipe(
          map(
            (geographicAddress: GeographicAddress) =>
              new GeographicAddressAction.CreateGeographicAddressSuccess({
                geographicAddress: geographicAddress,
              })
          ),
          catchError((error: any) =>
            of(
              new GeographicAddressAction.CreateGeographicAddressFail({
                errorResponse: makeErrorSerializable(error),
              })
            )
          )
        );
    })
  );

  @Effect()
  updateGeographicAddress$: Observable<Action> = this.actions$.pipe(
    ofType(GeographicAddressActionTypes.UPDATE_GEOGRAPHIC_ADDRESS),
    map(
      (action: GeographicAddressAction.UpdateGeographicAddress) =>
        action.payload
    ),
    concatMap((payload: any) => {
      return this.geographicAddressConnector
        .updateGeographicAddress(
          payload.baseSiteId,
          payload.geographicAddressId,
          payload.geographicAddress
        )
        .pipe(
          map(
            (geographicAddress: GeographicAddress) =>
              new GeographicAddressAction.UpdateGeographicAddressSuccess({
                geographicAddress: geographicAddress,
              })
          ),
          catchError((error: any) =>
            of(
              new GeographicAddressAction.UpdateGeographicAddressFail({
                errorResponse: makeErrorSerializable(error),
              })
            )
          )
        );
    })
  );

  @Effect()
  installationAddress$: Observable<Action> = this.actions$.pipe(
    ofType(
      GeographicAddressActionTypes.CREATE_GEOGRAPHIC_ADDRESS_SUCCESS,
      GeographicAddressActionTypes.UPDATE_GEOGRAPHIC_ADDRESS_SUCCESS
    ),
    map(
      (
        action:
          | GeographicAddressAction.CreateGeographicAddressSuccess
          | GeographicAddressAction.UpdateGeographicAddressSuccess
      ) => {
        if (action.payload.geographicAddress.isInstallationAddress) {
          return new GeographicAddressAction.SelectedInstallationAddress({
            selectedInstallationAddress: action.payload.geographicAddress,
          });
        }
      }
    )
  );
}
