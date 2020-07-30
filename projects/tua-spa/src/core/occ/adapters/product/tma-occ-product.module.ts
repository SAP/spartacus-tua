/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ConfigModule,
  OccProductAdapter,
  OccProductReferencesAdapter,
  OccProductReferencesListNormalizer,
  OccProductReviewsAdapter,
  OccProductSearchAdapter,
  OccProductSearchPageNormalizer,
  PRODUCT_NORMALIZER,
  PRODUCT_REFERENCES_NORMALIZER,
  PRODUCT_SEARCH_PAGE_NORMALIZER,
  ProductAdapter,
  ProductImageNormalizer,
  ProductNameNormalizer,
  ProductOccModule,
  ProductReferencesAdapter,
  ProductReviewsAdapter,
  ProductSearchAdapter
} from '@spartacus/core';
import { defaultTmaOccProductConfig } from './default-tma-occ-product-config';

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
      provide: PRODUCT_NORMALIZER,
      useExisting: ProductImageNormalizer,
      multi: true
    },
    {
      provide: PRODUCT_NORMALIZER,
      useExisting: ProductNameNormalizer,
      multi: true
    },
    {
      provide: ProductReferencesAdapter,
      useClass: OccProductReferencesAdapter
    },
    {
      provide: PRODUCT_REFERENCES_NORMALIZER,
      useExisting: OccProductReferencesListNormalizer,
      multi: true
    },
    {
      provide: ProductSearchAdapter,
      useClass: OccProductSearchAdapter
    },
    {
      provide: PRODUCT_SEARCH_PAGE_NORMALIZER,
      useExisting: OccProductSearchPageNormalizer,
      multi: true
    },
    {
      provide: ProductReviewsAdapter,
      useClass: OccProductReviewsAdapter
    }
  ]
})
export class TmaOccProductModule extends ProductOccModule { }
