import { TmfConfig } from '../..';

export const defaultTmfGeographicAddressConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        createGeographicAddress: {
          endpoint: 'geographicAddress'
        },
        updateGeographicAddress: {
          endpoint: 'geographicAddress/${id}'
        },
      },
    },
  },
};
