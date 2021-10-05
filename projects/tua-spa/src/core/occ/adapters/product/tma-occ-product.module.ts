import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ConfigModule,
  OccProductAdapter,
  OccProductReferencesAdapter,
  OccProductReviewsAdapter,
  ProductAdapter,
  ProductReferencesAdapter,
  ProductReviewsAdapter,
  ProductSearchAdapter,
  ProductOccModule
} from '@spartacus/core';
import { defaultTmaOccProductConfig } from './default-tma-occ-product-config';
import {
  TmaOccProductReferencesListNormalizer,
  TmaProductImageNormalizer,
  TmaProductNameNormalizer
} from './converters';
import { TMA_PRODUCT_NORMALIZER } from '../../../product/connectors/product/converters';
import { TMA_PRODUCT_REFERENCES_NORMALIZER } from '../../../product/connectors/references/converters';
import { TmaOccProductSearchAdapter } from './tma-occ-product-search.adapter';
import { TmaOccProductSearchPageNormalizer } from './converters';
import { TMA_PRODUCT_SEARCH_PAGE_NORMALIZER } from '../../../product';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmaOccProductConfig)
  ],
  providers: [
    {
      provide: ProductAdapter,
      useClass: OccProductAdapter
    },
    {
      provide: TMA_PRODUCT_NORMALIZER,
      useExisting: TmaProductImageNormalizer,
      multi: true
    },
    {
      provide: TMA_PRODUCT_NORMALIZER,
      useExisting: TmaProductNameNormalizer,
      multi: true
    },
    {
      provide: ProductReferencesAdapter,
      useClass: OccProductReferencesAdapter
    },
    {
      provide: TMA_PRODUCT_REFERENCES_NORMALIZER,
      useExisting: TmaOccProductReferencesListNormalizer,
      multi: true
    },
    {
      provide: ProductSearchAdapter,
      useClass: TmaOccProductSearchAdapter
    },
    {
      provide: TMA_PRODUCT_SEARCH_PAGE_NORMALIZER,
      useExisting: TmaOccProductSearchPageNormalizer,
      multi: true
    },
    {
      provide: ProductReviewsAdapter,
      useClass: OccProductReviewsAdapter
    }
  ]
})
export class TmaOccProductModule extends ProductOccModule {}
