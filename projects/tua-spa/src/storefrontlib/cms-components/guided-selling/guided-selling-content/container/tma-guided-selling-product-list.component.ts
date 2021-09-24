import { Component, Input } from '@angular/core';
import { PageLayoutService, ViewConfig } from '@spartacus/storefront';
import { TmaProductListComponent } from '../../../product/product-list';
import { TmaProductSearchService,TmaProductListComponentService, TmfProduct } from '../../../../../core';

@Component({
  selector: 'cx-guided-selling-product-list',
  templateUrl: './tma-guided-selling-product-list.component.html',
  styleUrls: ['./tma-guided-selling-product-list.component.scss']
})
export class TmaGuidedSellingProductListComponent extends TmaProductListComponent {

  @Input()
  tmfProducts: TmfProduct[];

  constructor(
    pageLayoutService: PageLayoutService,
    productListComponentService: TmaProductListComponentService,
    scrollConfig?: ViewConfig,
    productSearchService?: TmaProductSearchService
  ) {
    super(pageLayoutService, productListComponentService, productSearchService, scrollConfig);
  }
}
