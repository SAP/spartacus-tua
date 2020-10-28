import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrencyService } from '@spartacus/core';
import { ProductGridItemComponent } from '@spartacus/storefront';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-product-grid-item',
  templateUrl: './tma-product-grid-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductGridItemComponent extends ProductGridItemComponent {

  constructor(
    public priceService?: TmaPriceService,
    protected currencyService?: CurrencyService
  ) {
    super();
  }
}
