import { take, filter, takeUntil } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  TmaTmfRelatedParty,
  ResourceRef,
  Reservation,
  LogicalResource,
  TmaTmfRelatedPartyRole
} from '../../model';
import {
  StateWithReservation,
  ReservationAction,
  ReservationSelectors
} from '../store';
import { UserService, User } from '@spartacus/core';

@Injectable()
export class LogicalResourceReservationService implements OnDestroy {
  protected destroyed$ = new Subject();
  protected currentUser: TmaTmfRelatedParty;

  constructor(
    protected store: Store<StateWithReservation>,
    protected userService: UserService
  ) {
    this.userService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((customer: User) => {
        this.currentUser = {
          id: customer && customer.uid,
          role: TmaTmfRelatedPartyRole.CUSTOMER,
          name: customer.name
        };
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * This method is used to clear the invalid reservations.
   *
   * @param logicalResources LogicalResource[]
   *            List of invalid logical resource to be removed from state.
   *
   */
  public clearInvalidReservations(logicalResources: LogicalResource[]): void {
    const reservations: Reservation[] = [];
    logicalResources.forEach((logicalResource: LogicalResource) => {
      this.getReservationByLogicalResourceValue(logicalResource.value)
        .pipe(
          take(2),
          filter((result: Reservation) => !!result),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: Reservation) => {
          reservations.push(result);
        });
    });
    this.store.dispatch(
      new ReservationAction.ClearInvalidReservations({
        invalidReservations: reservations
      })
    );
  }

  /**
   * This method is used to clear the reservation error.
   */
  public clearReservationError(): void {
    this.store.dispatch(new ReservationAction.ClearReservationError());
  }

  /**
   * This method is used to clear the update reservation error.
   */
  public clearUpdateReservationError(): void {
    this.store.dispatch(new ReservationAction.ClearUpdateReservationError());
  }

  /**
   * Fetch the created reservation details.
   *
   * @returns Observable<Reservation>
   *             the details of created reservation
   */
  public getCreatedReservation(): Observable<Reservation> {
    return this.store.pipe(select(ReservationSelectors.getCreatedReservation));
  }

  /**
   * This method is used to determine error during reservation creation.
   *
   * @returns Observable<string>
   *            the error message indicating error occurred during reservation creation.
   */
  public getCreateReservationError(): Observable<string> {
    return this.store.pipe(
      select(ReservationSelectors.getCreateReservationError)
    );
  }

  /**
   * This method will return the reservation based on logical Resource value.
   *
   *  @param resourceValue string
   *            the resource value
   *  @returns Observable<Reservation>
   *                the reservation based on logical Resource value.
   */
  public getReservationByLogicalResourceValue(
    resourceValue: string
  ): Observable<Reservation> {
    return this.store.pipe(
      select(ReservationSelectors.getReservationByLogicalResourceValue, {
        resourceValue: resourceValue
      })
    );
  }

  /**
   * This method is used to determine the reservation error during update.
   *
   * @param cartEntryResourceValue - The resource value of the cart entry
   *
   * @returns Observable<string>
   *                the error message indicating error occurred while updating reservation.
   */
  public getUpdateReservationError(
    cartEntryResourceValue: string
  ): Observable<string> {
    let reservationId: string;
    this.getReservationByLogicalResourceValue(cartEntryResourceValue)
      .pipe(
        filter((result: Reservation) => !!result),
        take(1),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: Reservation) => {
        reservationId = result.id;
      });
    return this.store.pipe(
      select(ReservationSelectors.getUpdateReservationError, {
        reservationId: reservationId
      })
    );
  }

  /**
   * This method is used to determine if there are any cancelled reservation.
   *
   * @returns Observable<boolean>
   *                  true if there are cancelled/rejected reservations in cart
   */
  public hasCancelledReservations(): Observable<boolean> {
    return this.store.pipe(
      select(ReservationSelectors.hasCancelledReservations)
    );
  }

  /**
   * This method is used to determine if reservation is cancelled/rejected for cart entry.
   *
   * @param cartEntryResourceValue - The resource value of the cart entry
   *
   * @return Observable<boolean>
   *                  true if reservation is cancelled/rejected
   */
  public hasCancelledReservationForEntry(
    cartEntryResourceValue: string
  ): Observable<boolean> {
    return this.store.pipe(
      select(ReservationSelectors.hasReservationCancelled, {
        resourceValue: cartEntryResourceValue
      })
    );
  }

  /**
   * This method is used to determine if any reservation has error.
   *
   * @returns Observable<boolean>
   *                  true if reservation has error
   */
  public hasReservationError(): Observable<boolean> {
    return this.store.pipe(select(ReservationSelectors.hasReservationError));
  }

  /**
   * This method is used to load the reservations based on user and resource value.
   *
   * @param cartEntryResourceValues
   *             The resource values of the cart entry
   **/
  public loadReservationByUserIdAndResource(
    cartEntryResourceValues: string[]
  ): void {
    this.store.dispatch(
      new ReservationAction.LoadReservation({
        id: this.currentUser.id,
        cartEntryResourceValues: cartEntryResourceValues
      })
    );
  }

  /**
   * This method is used to clear the reservation state.
   */
  public clearReservationState(): void {
    this.store.dispatch(new ReservationAction.ClearReservation());
  }

  /**
   * This method is used to clear the created reservation state.
   */
  public clearCreatedReservationState(): void {
    this.store.dispatch(new ReservationAction.ClearCreatedReservation());
  }

  /**
   * This method is used to update reservation for logical resource.
   *  @param newResource
   *          The new resource to be updated
   *  @param  cartEntryResourceValue
   *           The old resource value from cart entry
   *  @returns Observable<Reservation>
   *             returns the updated reservation as {@link Observable}
   */
  public updateReservationForLogicalResource(
    newResource: ResourceRef,
    cartEntryResourceValue: string
  ): Observable<Reservation> {
    const updatedReservation = {
      value: newResource,
      op: 'replace'
    };
    this.getReservationByLogicalResourceValue(cartEntryResourceValue)
      .pipe(
        filter((result: Reservation) => !!result),
        take(1),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: Reservation) => {
        this.store.dispatch(
          new ReservationAction.UpdateReservation({
            updatedReservation: updatedReservation,
            reservationId: result.id
          })
        );
      });
    return this.getReservationByLogicalResourceValue(newResource.value);
  }
}
