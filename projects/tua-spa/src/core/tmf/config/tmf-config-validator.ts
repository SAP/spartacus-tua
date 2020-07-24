import { TmfConfig } from './tmf-config';

export function tmfConfigValidator(config: TmfConfig) {
  if (
    config.backend === undefined ||
    config.backend.tmf === undefined ||
    config.backend.tmf.baseUrl === undefined
  ) {
    return 'Please configure backend.tmf.baseUrl before using storefront library!';
  }
}
