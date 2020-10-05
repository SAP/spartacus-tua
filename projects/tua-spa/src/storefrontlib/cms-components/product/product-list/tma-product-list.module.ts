import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ConfigModule,
  I18nModule,
  UrlModule,
  FeaturesConfigModule
} from '@spartacus/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  defaultScrollConfig,
  IconModule,
  ItemCounterModule,
  ListNavigationModule,
  MediaModule,
  ProductListModule,
  SpinnerModule,
  StarRatingModule,
  ViewConfigModule
} from '@spartacus/storefront';
import { TmaProductListComponent } from './container/tma-product-list.component';
import { TmaProductListItemComponent } from './product-list-item/tma-product-list-item.component';
import { TmaProductGridItemComponent } from './product-grid-item/tma-product-grid-item.component';
import { TmaProductScrollComponent } from './container/product-scroll/tma-product-scroll.component';
import { TmaAddToCartModule } from '../../cart';
import { TmaProductFacetNavigationComponent } from './product-facet-navigation/tma-product-facet-navigation.component';
import { TmaProductViewComponent } from './product-view/tma-product-view.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(defaultScrollConfig),
    ConfigModule.withConfig({
      cmsComponents: {
        CMSProductListComponent: {
          component: TmaProductListComponent
        },
        ProductGridComponent: {
          component: TmaProductListComponent
        },
        SearchResultsListComponent: {
          component: TmaProductListComponent
        },
        ProductRefinementComponent: {
          component: TmaProductFacetNavigationComponent
        }
      }
    }),
    RouterModule,
    MediaModule,
    TmaAddToCartModule,
    ItemCounterModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    StarRatingModule,
    IconModule,
    SpinnerModule,
    InfiniteScrollModule,
    ViewConfigModule,
    FeaturesConfigModule
  ],
  declarations: [
    TmaProductListComponent,
    TmaProductFacetNavigationComponent,
    TmaProductListItemComponent,
    TmaProductGridItemComponent,
    TmaProductViewComponent,
    TmaProductScrollComponent
  ],
  exports: [
    TmaProductListComponent,
    TmaProductFacetNavigationComponent,
    TmaProductListItemComponent,
    TmaProductGridItemComponent,
    TmaProductViewComponent,
    TmaProductScrollComponent
  ],
  entryComponents: [TmaProductListComponent, TmaProductFacetNavigationComponent]
})
export class TmaProductListModule extends ProductListModule { }
