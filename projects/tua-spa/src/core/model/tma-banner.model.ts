import { CmsBannerComponent } from '@spartacus/core';

import { TmaProduct } from './tma-product.model';

export interface TmaCmsServiceabilityBannerComponent extends CmsBannerComponent {
  simpleProductOffering?: TmaProduct;
  buttonText?: string;
  bundledProductOffering?: TmaProduct;

}
export interface TmaCmsBannerRenewalComponent extends CmsBannerComponent {
  buttonText?: string;

}
