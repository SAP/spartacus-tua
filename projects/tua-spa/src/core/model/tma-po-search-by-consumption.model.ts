import { TmaImage } from './tma-image.model';
import { TmaBillingEvent, TmaUsageUnit } from './tma-product.model';
import { TmaProductSpecification } from './tma-product-specification.model';

export interface TmaSliderOption {
  uid: string;
  name: string;
  media: TmaImage;
  value: number;
}

export interface TmaPoSearchByConsumption {
  productSpecification: TmaProductSpecification;
  usageUnit: TmaUsageUnit;
  billingEvent?: TmaBillingEvent;
  sliderOptionComponents?: TmaSliderOption[];
  billingFrequency: string;
  name: string;
}
