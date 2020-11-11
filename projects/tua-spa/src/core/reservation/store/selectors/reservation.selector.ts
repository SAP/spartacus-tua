import {
  AppliedCapacityAmount,
  ResourceRef,
  Reservation,
  ReservationStateType,
  ReservationItem
} from '../../../model';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps
} from '@ngrx/store';
import {
  StateWithReservation,
  RESERVATION_POOL_MANAGEMENT_FEATURE,
  ReservationState,
  ReservationError
} from '../reservation.state';

export const getReservationFeatureState: MemoizedSelector<StateWithReservation,
  ReservationState> = createFeatureSelector<ReservationState>(
  RESERVATION_POOL_MANAGEMENT_FEATURE
);

export const getAllReservation: MemoizedSelector<StateWithReservation,
  Reservation[]> = createSelector(getReservationFeatureState, (state: ReservationState) =>
  state.reservations ? state.reservations : undefined
);

export const getCreatedReservation: MemoizedSelector<StateWithReservation,
  Reservation> = createSelector(getReservationFeatureState, (state: ReservationState) => {
  return state.newReservation ? state.newReservation : undefined;
});

export const getReservationByLogicalResourceValue: MemoizedSelectorWithProps<StateWithReservation,
  any,
  Reservation> = createSelector(getAllReservation, (state: Reservation[], props) => {
  let tmaReservation: Reservation;
  state.find((reservation: Reservation) => {
    reservation.reservationItem.find((item: ReservationItem) =>
      item.appliedCapacityAmount.find((appliedCapacity: AppliedCapacityAmount) => {
          appliedCapacity.resource.find((logicalResource: ResourceRef) => {
            if (logicalResource.value === props.resourceValue) {
              tmaReservation = reservation;
            }
          });
        }
      )
    );
  });
  return tmaReservation;
});

export const hasReservationCancelled: MemoizedSelectorWithProps<StateWithReservation,
  any,
  boolean> = createSelector(
  getReservationByLogicalResourceValue,
  (state: Reservation) => {
    return state
      ? state.reservationState === ReservationStateType.CANCELLED ||
      state.reservationState === ReservationStateType.REJECTED
      : false;
  }
);

export const getAllReservationError: MemoizedSelector<StateWithReservation,
  ReservationError[]> = createSelector(
  getReservationFeatureState,
  (state: ReservationState) => state.reservationErrors
);

export const getCreateReservationError: MemoizedSelector<StateWithReservation,
  string> = createSelector(getAllReservationError, (state: ReservationError[]) => {
  return state && state.length > 0 && state[0]
    ? state[0].reservationError
    : undefined;
});

export const hasReservationError: MemoizedSelector<StateWithReservation,
  boolean> = createSelector(getAllReservationError, (state: ReservationError[]) => {
  return state.length > 0;
});

export const hasCancelledReservations: MemoizedSelector<StateWithReservation,
  boolean> = createSelector(getAllReservation, (state: Reservation[]) => {
  return !!state.find(
    (reservation: Reservation) =>
      reservation.reservationState === ReservationStateType.CANCELLED ||
      reservation.reservationState === ReservationStateType.REJECTED
  );
});

export const getUpdateReservationErrorState: MemoizedSelector<StateWithReservation,
  ReservationError> = createSelector(
  getReservationFeatureState,
  (state: ReservationState) => state.updateReservationError
);

export const getUpdateReservationError: MemoizedSelectorWithProps<StateWithReservation,
  any,
  string> = createSelector(
  getUpdateReservationErrorState,
  (state: ReservationError, props) => {
    return state.reservationId === props.reservationId
      ? state.reservationError
      : undefined;
  }
);
