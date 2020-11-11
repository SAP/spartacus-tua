import { Appointment } from '../../model';
import { LoaderState } from '@spartacus/core';

export const APPOINTMENT_FEATURE = 'appointment';
export const APPOINTMENT_DATA = '[Appointment] Appointment Data';

export interface StateWithAppointment {
  [APPOINTMENT_FEATURE]: AppointmentState;
}

export interface AppointmentState {
  appointments?: LoaderState<Appointment[]>;
  newAppointment?: LoaderState<Appointment>;
  error?: LoaderState<AppointmentError[]>;
  updateAppointmentError?: LoaderState<AppointmentError>;
}

export interface AppointmentError {
  appointmentId?: string;
  appointmentError?: string;
}
