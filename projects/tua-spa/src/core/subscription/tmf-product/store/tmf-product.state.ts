import { TmfProduct } from '../../../model';

export const TMF_PRODUCT_FEATURE = 'tmf-product';

export interface TmaStateWithTmfProduct {
  [TMF_PRODUCT_FEATURE]: TmfProductState;
}

export class TmfProductMap {
  tmfProduct?: TmfProduct;
  id?: string;
  baseSiteId?: string;
  tmfProducts?: TmfProduct[];
}

export interface TmfProductState {
  tmfProductMap?: TmfProductMap[];
}
