import { SiteContextConfig } from '@spartacus/core';
import { TmfAppointmentEndpointMap } from '..';

export abstract class TmfAppointmentConfig extends SiteContextConfig {
  backend?: {
    tmf_appointment?: {
      baseUrl?: string;
      prefix?: string;
      endpoints?: TmfAppointmentEndpointMap;
    };
  };
}
