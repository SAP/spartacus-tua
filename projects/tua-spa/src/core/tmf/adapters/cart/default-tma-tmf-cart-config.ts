import { TmfConfig } from '../..';

export const defaultTmaTmfCartConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        updateShoppingCart: {
          endpoint: 'shoppingCart/${id}'
        },
      },
    },
  },
};
