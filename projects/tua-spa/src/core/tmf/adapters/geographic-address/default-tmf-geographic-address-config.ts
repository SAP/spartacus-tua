import { TmfConfig } from '../..';

export const defaultTmfGeographicAddressConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        createGeographicAddress: 'geographicAddress',
        updateGeographicAddress: 'geographicAddress/${id}',
      },
    },
  },
};
