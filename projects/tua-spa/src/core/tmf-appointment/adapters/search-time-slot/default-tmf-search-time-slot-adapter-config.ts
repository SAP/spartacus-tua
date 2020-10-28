import { TmfAppointmentConfig } from '../../config';

export const defaultTmfSearchTimeSlotAdapterConfig: TmfAppointmentConfig = {
  backend: {
    tmf_appointment: {
      endpoints: {
        searchTimeSlot: {
          baseUrl: 'http://localhost:8080',
          prefix: '/tmf-api',
          endpoint: '/appointment/v4/searchTimeSlot',
        },
      },
    },
  },
};
