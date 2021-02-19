import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrentProductService, ProductSummaryComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import {TmaProduct} from "../../../../core/model";

@Component({
  selector: 'cx-product-summary',
  templateUrl: './tma-product-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductSummaryComponent extends ProductSummaryComponent {

  product$: Observable<TmaProduct>;

  constructor(protected currentProductService: CurrentProductService) {
    super(currentProductService);
  }
}
