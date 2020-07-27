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
