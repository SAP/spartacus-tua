import { Component } from '@angular/core';
import { PageLayoutService, ViewConfig } from '@spartacus/storefront';
import { TmaProductListComponent } from '../../../product/product-list';
import { TmaProductSearchService,TmaProductListComponentService } from '../../../../../core';

@Component({
  selector: 'cx-guided-selling-product-list',
  templateUrl: './tma-guided-selling-product-list.component.html',
  styleUrls: ['./tma-guided-selling-product-list.component.scss']
})
export class TmaGuidedSellingProductListComponent extends TmaProductListComponent {

  constructor(
    pageLayoutService: PageLayoutService,
    productListComponentService: TmaProductListComponentService,
    scrollConfig?: ViewConfig,
    productSearchService?: TmaProductSearchService
  ) {
    super(pageLayoutService, productListComponentService, productSearchService, scrollConfig);
  }
}
