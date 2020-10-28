import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';
import {
  TmaStateWithTmfProduct,
  TmfProductState,
  TMF_PRODUCT_FEATURE,
  TmfProductMap,
} from '../tmf-product.state';
import { TmfProduct } from '../../../../model';

export const getTmfProductFeatureState: MemoizedSelector<
  TmaStateWithTmfProduct,
  TmfProductState
> = createFeatureSelector<TmfProductState>(TMF_PRODUCT_FEATURE);

export const getTmfProductDetails: MemoizedSelector<
  TmaStateWithTmfProduct,
  TmfProductMap[]
> = createSelector(
  getTmfProductFeatureState,
  (state: TmfProductState) => state.tmfProductMap
);

export const getTmfProduct: MemoizedSelectorWithProps<
  TmaStateWithTmfProduct,
  any,
  TmfProduct
> = createSelector(
  getTmfProductDetails,
  (state: TmfProductMap[], props: any) => {
    const tmfProduct: TmfProductMap = state
      ? state.find(
          (sp: TmfProductMap) =>
            sp.tmfProductId === props.tmfProductId &&
            sp.baseSiteId === props.baseSiteId
        )
      : undefined;
    return tmfProduct ? tmfProduct.tmfProduct : undefined;
  }
);
