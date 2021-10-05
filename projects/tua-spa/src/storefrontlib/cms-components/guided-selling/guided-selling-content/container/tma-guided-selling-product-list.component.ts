import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageLayoutService, ViewConfig } from '@spartacus/storefront';
import {
  TmaConfigurablePscInputsDataHandlingService,
  TmaGuidedSellingProductConfigSelectionsService,
  TmaGuidedSellingStep,
  TmaGuidedSellingStepsService,
  TmaProductListComponentService,
  TmaProductSearchService,
  TmfProduct
} from '../../../../../core';
import { TmaProductListComponent } from '../../../product/product-list';

@Component({
  selector: 'cx-guided-selling-product-list',
  templateUrl: './tma-guided-selling-product-list.component.html',
  styleUrls: ['./tma-guided-selling-product-list.component.scss']
})
export class TmaGuidedSellingProductListComponent
  extends TmaProductListComponent
  implements OnInit {
  @Input()
  tmfProducts: TmfProduct[];
  guidedSellingSteps: TmaGuidedSellingStep[];

  constructor(
    protected guidedSellingProductConfigSelectionsService: TmaGuidedSellingProductConfigSelectionsService,
    protected configurablePscvusService: TmaConfigurablePscInputsDataHandlingService,
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected activatedRoute: ActivatedRoute,
    pageLayoutService: PageLayoutService,
    productListComponentService: TmaProductListComponentService,
    scrollConfig?: ViewConfig,
    productSearchService?: TmaProductSearchService
  ) {
    super(
      pageLayoutService,
      productListComponentService,
      productSearchService,
      scrollConfig
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.configurablePscvusService.cleanData();
  }
}
