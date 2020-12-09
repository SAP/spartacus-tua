import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrencyService } from '@spartacus/core';
import { ProductListItemComponent } from '@spartacus/storefront';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-product-list-item',
  templateUrl: './tma-product-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductListItemComponent extends ProductListItemComponent {

  constructor(
    public priceService?: TmaPriceService,
    protected currencyService?: CurrencyService
  ) {
    super();
  }
}
