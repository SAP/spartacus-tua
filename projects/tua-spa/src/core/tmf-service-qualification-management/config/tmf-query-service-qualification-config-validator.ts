import { TmfQueryServiceQualificationConfig } from './tmf-query-service-qualification-config';

export function tmfQueryServiceQualificationConfigValidator(
  config: TmfQueryServiceQualificationConfig
) {
  if (
    config.backend === undefined ||
    config.backend.tmf_query_service_qualification === undefined ||
    config.backend.tmf_query_service_qualification.baseUrl === undefined
  ) {
    return 'Please configure backend.query_service_qualification.baseUrl before using storefront library!';
  }
}
