import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, concatMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { ReservationConnector } from '../../connectors';
import { ReservationAction } from '../actions';
import { ReservationActionTypes } from '../actions/reservation.action';
import { Reservation } from '../../../model';

@Injectable()
export class ReservationEffect {
  constructor(
    protected actions$: Actions,
    protected reservationConnector: ReservationConnector
  ) {
  }

  @Effect()
  createReservation$: Observable<| ReservationAction.CreateReservation
    | ReservationAction.CreateReservationSuccess
    | ReservationAction.CreateReservationFail> = this.actions$.pipe(
    ofType(ReservationActionTypes.CREATE_RESERVATION_POOL_MANAGEMENT),
    map((action: ReservationAction.CreateReservation) => action.payload),
    mergeMap((payload: any) => {
      return this.reservationConnector.createReservation(payload).pipe(
        map((reservation: Reservation) => {
          return new ReservationAction.CreateReservationSuccess({
            reservation: reservation
          });
        }),
        catchError((error: any) =>
          of(
            new ReservationAction.CreateReservationFail({
              errorResponse: makeErrorSerializable(error)
            })
          )
        )
      );
    })
  );

  @Effect()
  updateReservation$: Observable<| ReservationAction.UpdateReservation
    | ReservationAction.UpdateReservationSuccess
    | ReservationAction.UpdateReservationFail> = this.actions$.pipe(
    ofType(ReservationActionTypes.UPDATE_RESERVATION_POOL_MANAGEMENT),
    map((action: ReservationAction.UpdateReservation) => action.payload),
    mergeMap((payload: any) => {
      return this.reservationConnector
        .updateReservation(payload.updatedReservation, payload.reservationId)
        .pipe(
          map((reservation: Reservation) => {
            return new ReservationAction.UpdateReservationSuccess({
              reservation: reservation
            });
          }),
          catchError((error: any) =>
            of(
              new ReservationAction.UpdateReservationFail({
                id: payload.reservationId,
                errorResponse: makeErrorSerializable(error)
              })
            )
          )
        );
    })
  );

  @Effect()
  getReservationsForUser$: Observable<| ReservationAction.LoadReservation
    | ReservationAction.LoadReservationSuccess
    | ReservationAction.LoadReservationFail> = this.actions$.pipe(
    ofType(ReservationActionTypes.LOAD_RESERVATION_POOL_MANAGEMENT),
    map((action: ReservationAction.LoadReservation) => action.payload),
    concatMap((payload: any) => {
      return this.reservationConnector
        .getReservationsByUserId(payload.id, payload.cartEntryResourceValues)
        .pipe(
          map(
            (content: Reservation[]) =>
              new ReservationAction.LoadReservationSuccess({
                reservation: content,
                resourceValues: payload.cartEntryResourceValues
              })
          ),
          catchError((error: any) =>
            of(
              new ReservationAction.LoadReservationFail({
                id: payload.id,
                errorResponse: makeErrorSerializable(error)
              })
            )
          )
        );
    })
  );
}
