import { NgModule } from '@angular/core';
import {  ProductReviewsModule, ProductTabsModule } from '@spartacus/storefront';
import { TmaProductDetailsTabModule } from './product-details-tab/tma-product-details-tab.module';
import { TmaProductAttributesModule } from './product-attributes/tma-product-attributes-module';

@NgModule({
  imports: [
    TmaProductAttributesModule,
    TmaProductDetailsTabModule,
    ProductReviewsModule
  ]
})
export class TmaProductTabsModule extends ProductTabsModule { }
