import { Injectable } from '@angular/core';
import { BackendConfig, Config, SiteContextConfig } from '@spartacus/core';
import { TmfAppointmentEndpointMap } from '..';

interface TmfAppointmentBackendConfig extends BackendConfig {
  tmf_appointment?: {
    baseUrl?: string;
    prefix?: string;
    endpoints?: TmfAppointmentEndpointMap;
  };
}

@Injectable({
providedIn: 'root',
useExisting: Config
})
export abstract class TmfAppointmentConfig extends SiteContextConfig {
  backend?: TmfAppointmentBackendConfig;
}