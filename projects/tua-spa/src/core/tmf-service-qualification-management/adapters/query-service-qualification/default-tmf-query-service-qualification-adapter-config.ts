import { TmfQueryServiceQualificationConfig } from '../../config';

export const defaultTmfQueryServiceQualificationAdapterConfig: TmfQueryServiceQualificationConfig = {
  backend: {
    tmf_query_service_qualification: {
      endpoints: {
        queryServiceQualification: {
          endpoint:
            '/serviceQualificationManagement/v4/queryServiceQualification'
        }
      }
    }
  }
};
