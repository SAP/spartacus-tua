import {
  MemoizedSelector,
  createFeatureSelector,
  createSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';
import {
  StateWithAppointment,
  APPOINTMENT_FEATURE,
  AppointmentState,
  AppointmentError,
} from '../appointment-state';
import { Appointment } from '../../../model';
import { LoaderState, StateLoaderSelectors } from '@spartacus/core';
import { AppointmentStateType } from '../../../model/appointment.model';

export const getAppointmentsFeatureState: MemoizedSelector<
  StateWithAppointment,
  AppointmentState
> = createFeatureSelector<AppointmentState>(APPOINTMENT_FEATURE);

export const getAppointmentsState: MemoizedSelector<
  StateWithAppointment,
  LoaderState<Appointment[]>
> = createSelector(
  getAppointmentsFeatureState,
  (state: AppointmentState) => state.appointments
);

export const getAllAppointments: MemoizedSelector<
  StateWithAppointment,
  Appointment[]
> = createSelector(
  getAppointmentsState,
  StateLoaderSelectors.loaderValueSelector
);

export const getAppointmentById: MemoizedSelectorWithProps<
  StateWithAppointment,
  any,
  Appointment
> = createSelector(getAllAppointments, (state: Appointment[], props) => {
  return state
    ? state.find((appointment: Appointment) => appointment.id === props.id)
    : undefined;
});

export const getAllAppointmentError: MemoizedSelector<
  StateWithAppointment,
  LoaderState<AppointmentError[]>
> = createSelector(
  getAppointmentsFeatureState,
  (state: AppointmentState) => state.error
);

export const getCreatedAppointmentState: MemoizedSelector<
  StateWithAppointment,
  LoaderState<Appointment>
> = createSelector(
  getAppointmentsFeatureState,
  (state: AppointmentState) => state.newAppointment
);

export const getCreatedAppointment: MemoizedSelector<
  StateWithAppointment,
  Appointment
> = createSelector(
  getCreatedAppointmentState,
  StateLoaderSelectors.loaderValueSelector
);

export const getAppointmentErrorForAppointmentID: MemoizedSelectorWithProps<
  StateWithAppointment,
  any,
  string
> = createSelector(
  getAllAppointmentError,
  (state: LoaderState<AppointmentError[]>, props) => {
    const appointmentError = state
      ? state.value.find(
          (errorMap: AppointmentError) => errorMap.appointmentId === props.id
        )
      : undefined;
    if (!!appointmentError) {
      return appointmentError.appointmentError;
    }
  }
);

export const getCreateAppointmentError: MemoizedSelector<
  StateWithAppointment,
  string
> = createSelector(
  getAllAppointmentError,
  (state: LoaderState<AppointmentError[]>) => {
    const createAppointmentError = state.value[0] ? state.value[0] : undefined;
    if (!!createAppointmentError) {
      return createAppointmentError.appointmentError;
    }
  }
);

export const getAppointmentError: MemoizedSelector<
  StateWithAppointment,
  boolean
> = createSelector(
  getAllAppointmentError,
  (state: LoaderState<AppointmentError[]>) => {
    const hasAppointmentError = state.value.length > 0 ? true : false;
    return hasAppointmentError;
  }
);

export const getCancelledAppointment: MemoizedSelector<
  StateWithAppointment,
  boolean
> = createSelector(getAllAppointments, (state: Appointment[]) => {
  const hasCancelledAppointment = state.find(
    (appointment) => appointment.status === AppointmentStateType.CANCELLED
  )
    ? true
    : false;
  return hasCancelledAppointment;
});

export const getUpdateAppointmentErrorState: MemoizedSelector<
  StateWithAppointment,
  LoaderState<AppointmentError>
> = createSelector(
  getAppointmentsFeatureState,
  (state: AppointmentState) => state.updateAppointmentError
);

export const getUpdateAppointmentError: MemoizedSelectorWithProps<
  StateWithAppointment,
  any,
  string
> = createSelector(
  getUpdateAppointmentErrorState,
  (state: LoaderState<AppointmentError>, props) => {
    return state.value.appointmentId === props.id
      ? state.value.appointmentError
      : undefined;
  }
);
