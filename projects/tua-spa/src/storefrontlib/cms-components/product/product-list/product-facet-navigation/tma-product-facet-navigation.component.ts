import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService, ProductFacetNavigationComponent, ProductListComponentService } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-facet-navigation',
  templateUrl: './tma-product-facet-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductFacetNavigationComponent extends ProductFacetNavigationComponent {

  constructor(
    protected tmaModalService: ModalService,
    protected tmaActivatedRoute: ActivatedRoute,
    protected tmaProductListComponentService: ProductListComponentService
  ) {
    super(tmaModalService, tmaActivatedRoute, tmaProductListComponentService)
  }
}
