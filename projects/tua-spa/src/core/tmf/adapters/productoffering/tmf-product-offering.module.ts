import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigModule } from '@spartacus/core';
import {
  ProductOfferingAdapter,
  PRODUCT_OFFERING_NORMALIZER,
  PRODUCT_OFFERING_PRICE_NORMALIZER
} from '../../../productoffering';
import { TmfProductOfferingPriceNormalizer } from './converters';
import { TmfProductOfferingNormalizer } from './converters/tmf-product-offering-normalizer';
import { defaultTmfProductOfferingConfig } from './default-tmf-product-offering-config';
import { TmfProductOfferingAdapter } from './tmf-product-offering.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfProductOfferingConfig)
  ],
  providers: [
    {
      provide: ProductOfferingAdapter,
      useClass: TmfProductOfferingAdapter
    },
    {
      provide: PRODUCT_OFFERING_NORMALIZER,
      useExisting: TmfProductOfferingNormalizer,
      multi: true
    },
    {
      provide: PRODUCT_OFFERING_PRICE_NORMALIZER,
      useExisting: TmfProductOfferingPriceNormalizer,
      multi: true
    }
  ]
})
export class TmfProductOfferingModule {}
