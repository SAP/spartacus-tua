import { TmfConfig } from '../..';

export const defaultTmaTmfCartConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        shoppingCart:
          'shoppingCart/${id}'
      }
    }
  }
};
