import { TmfQueryServiceQualificationConfig } from './tmf-query-service-qualification-config';

export const defaultTmfQueryServiceQualificationConfig: TmfQueryServiceQualificationConfig = {
  backend: {
    tmf_query_service_qualification: {
      baseUrl: 'http://localhost:8080',
      prefix: '/tmf-api'
    }
  }
};
