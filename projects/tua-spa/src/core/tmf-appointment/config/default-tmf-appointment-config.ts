import { TmfAppointmentConfig } from './tmf-appointment-config';

export const defaultTmfAppointmentConfig: TmfAppointmentConfig = {
  backend: {
    tmf_appointment: {
      baseUrl: 'http://localhost:8080',
      prefix: '/tmf-api',
    },
  },
};
