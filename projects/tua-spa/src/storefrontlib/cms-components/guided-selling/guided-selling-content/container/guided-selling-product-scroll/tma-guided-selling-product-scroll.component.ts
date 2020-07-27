import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductListComponentService } from '@spartacus/storefront';
import { TmaProductScrollComponent } from '../../../../product/product-list';

@Component({
  selector: 'cx-guided-selling-product-scroll',
  templateUrl: './tma-guided-selling-product-scroll.component.html',
  styleUrls: ['./tma-guided-selling-product-scroll.component.scss']
})
export class TmaGuidedSellingProductScrollComponent extends TmaProductScrollComponent {

  constructor(
    protected tmaProductListComponentService: ProductListComponentService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(tmaProductListComponentService, changeDetectorRef);
  }
}
