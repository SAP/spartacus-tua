import { Observable } from 'rxjs';
import { Reservation } from '../../../model';

export abstract class ReservationAdapter {

  /**
   * Abstract method used to create reservation
   *
   * @param reservation
   *          Reservation to be create
   * @returns Observable<Reservation>
   *          Created reservation
   */
  abstract createReservation(reservation: Reservation): Observable<Reservation>;

  /**
   * Abstract method used to update the reservation
   *
   * @param updateReservation
   *              Reservation to be update
   * @param reservationId
   *               Id of the reservation
   * @returns Observable<Reservation>
   *               Updated reservation
   */
  abstract updateReservation(
    updateReservation: Reservation,
    reservationId: string
  ): Observable<Reservation>;

  /**
   * Abstract method used to get Reservations based on user
   *
   * @param userId
   *        user id
   * @param  cartEntryResourceValues
   *              cart entry resource value
   * @returns Reservation[]
   *         List of Reservations
   */
  abstract getReservationsByUserId(
    userId: string,
    cartEntryResourceValues: string[]
  ): Observable<Reservation[]>;
}
