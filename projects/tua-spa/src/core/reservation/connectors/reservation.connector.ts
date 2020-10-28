import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationAdapter } from '../store/adapters';
import { Reservation } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class ReservationConnector {
  constructor(protected adapter: ReservationAdapter) {
  }

  /**
   * This method is used to create reservation
   *
   * @param reservation
   *          Reservation to be create
   * @returns Observable<Reservation>
   *           the Created reservation
   */
  public createReservation(reservation: Reservation): Observable<Reservation> {
    return this.adapter.createReservation(reservation);
  }

  /**
   * This method is used to update the reservation
   *
   * @param updateReservation
   *              Reservation to be update
   * @param reservationId
   *               Id of the reservation
   * @returns Observable<Reservation>
   *               Updated reservation
   */
  public updateReservation(
    updateReservation: Reservation,
    reservationId: string
  ): Observable<Reservation> {
    return this.adapter.updateReservation(updateReservation, reservationId);
  }

  /**
   * This method is used to get get Reservations for provided user
   *
   * @param  userId
   *              userId
   * @param  cartEntryResourceValues
   *              cart entry resource value
   * @return  Reservation[]
   *              list of reservations
   */
  public getReservationsByUserId(
    userId: string,
    cartEntryResourceValues: string[]
  ): Observable<Reservation[]> {
    return this.adapter.getReservationsByUserId(
      userId,
      cartEntryResourceValues
    );
  }
}
