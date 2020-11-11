import { TmaImage } from './tma-image.model';
import { TmaBillingEvent, TmaProductSpecification, TmaUsageUnit } from './tma-product.model';

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
