import { TmfAppointmentConfig } from './tmf-appointment-config';

export function tmfAppointmentConfigValidator(config: TmfAppointmentConfig) {
  if (
    config.backend === undefined ||
    config.backend.tmf_appointment === undefined ||
    config.backend.tmf_appointment.baseUrl === undefined
  ) {
    return 'Please configure backend.tmf_appointment.baseUrl before using storefront library!';
  }
}
