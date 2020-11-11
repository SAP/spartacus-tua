import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CmsService } from '@spartacus/core';
import { ModalService, PageLayoutService, ProductListComponentService, ViewConfig } from '@spartacus/storefront';
import { TmaConsumptionConfig } from '../../../../../core/config/consumption/config';
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
    scrollConfig: ViewConfig,
    protected consumptionConfig: TmaConsumptionConfig,
    protected activatedRoute: ActivatedRoute,
    protected cmsService: CmsService,
    protected modalService: ModalService
  ) {
    super(pageLayoutService, productListComponentService, consumptionConfig, activatedRoute, cmsService, scrollConfig, modalService);
  }
}
