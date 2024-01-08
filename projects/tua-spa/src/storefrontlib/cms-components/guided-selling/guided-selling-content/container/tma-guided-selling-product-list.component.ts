import { Component } from '@angular/core';
import { PageLayoutService, ProductListComponentService, ViewConfig } from '@spartacus/storefront';
import { TmaProductListComponent } from '../../../product/product-list';

@Component({
  selector: 'cx-guided-selling-product-list',
  templateUrl: './tma-guided-selling-product-list.component.html',
  styleUrls: ['./tma-guided-selling-product-list.component.scss']
})
export class TmaGuidedSellingProductListComponent extends TmaProductListComponent {

  constructor(
    pageLayoutService: PageLayoutService,
    productListComponentService: ProductListComponentService,
    scrollConfig?: ViewConfig
  ) {
    super(pageLayoutService, productListComponentService, scrollConfig);
  }
}
