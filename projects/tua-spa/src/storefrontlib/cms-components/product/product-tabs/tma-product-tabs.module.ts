/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { NgModule } from '@angular/core';
import { ProductAttributesModule, ProductReviewsModule, ProductTabsModule } from '@spartacus/storefront';
import { TmaProductDetailsTabModule } from './product-details-tab/tma-product-details-tab.module';

@NgModule({
  imports: [
    ProductAttributesModule,
    TmaProductDetailsTabModule,
    ProductReviewsModule
  ]
})
export class TmaProductTabsModule extends ProductTabsModule { }
