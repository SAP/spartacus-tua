import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IconModule,
  ItemCounterModule,
  ListNavigationModule,
  MediaModule,
  SpinnerModule,
  StarRatingModule,
  ViewConfigModule
} from '@spartacus/storefront';
import { FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { TmaGuidedSellingProductListItemComponent } from './guided-selling-product-list-item/tma-guided-selling-product-list-item.component';
import { TmaGuidedSellingProductGridItemComponent } from './guided-selling-product-grid-item/tma-guided-selling-product-grid-item.component';
import { TmaGuidedSellingProductListComponent } from './container/tma-guided-selling-product-list.component';
import { TmaGuidedSellingCurrentSelectionModule } from '../guided-selling-current-selection';
import { TmaGuidedSellingProductScrollComponent } from './container/guided-selling-product-scroll/tma-guided-selling-product-scroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TmaAddToCartModule } from '../../cart';
import { TmaProductListModule } from '../../product/product-list';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MediaModule,
    TmaAddToCartModule,
    ItemCounterModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    StarRatingModule,
    IconModule,
    ViewConfigModule,
    FeaturesConfigModule,
    TmaProductListModule,
    TmaGuidedSellingCurrentSelectionModule,
    InfiniteScrollModule,
    SpinnerModule
  ],
  declarations: [
    TmaGuidedSellingProductListComponent,
    TmaGuidedSellingProductListItemComponent,
    TmaGuidedSellingProductGridItemComponent,
    TmaGuidedSellingProductScrollComponent
  ],
  exports: [
    TmaGuidedSellingProductListComponent,
    TmaGuidedSellingProductListItemComponent,
    TmaGuidedSellingProductGridItemComponent,
    TmaGuidedSellingProductScrollComponent
  ]
})
export class TmaGuidedSellingContentModule extends TmaProductListModule { }
