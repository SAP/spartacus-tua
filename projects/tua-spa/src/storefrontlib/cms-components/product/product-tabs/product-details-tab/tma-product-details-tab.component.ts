import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrentProductService, ProductDetailsTabComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaProduct, TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-product-details-tab',
  templateUrl: './tma-product-details-tab.component.html',
  styleUrls: ['./tma-product-details-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductDetailsTabComponent extends ProductDetailsTabComponent {

  product$: Observable<TmaProduct>;

  constructor(
    public priceService: TmaPriceService,
    protected currentProductService: CurrentProductService,
  ) {
    super(currentProductService);
  }

  isContractTermDisplayNeeded(priceList: TmaProductOfferingPrice[]): boolean {
    if (!priceList || priceList.length === 0) {
      return false;
    }

    return !!priceList.find((pop: TmaProductOfferingPrice) => pop.chargeType === 'recurring' || pop.chargeType === 'usage');
  }
}
