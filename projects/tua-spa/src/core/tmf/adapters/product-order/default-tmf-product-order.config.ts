import { TmfConfig } from '../..';

/**
 * Default endpoint configuration for product order
 */
export const defaultTmfProductOrderConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getProductOrders: {
          endpoint: 'productOrdering/productOrder'
        },
        updateOrder: {
          endpoint: '/productOrdering/productOrder/${id}'
        }
      }
    }
  }
};
