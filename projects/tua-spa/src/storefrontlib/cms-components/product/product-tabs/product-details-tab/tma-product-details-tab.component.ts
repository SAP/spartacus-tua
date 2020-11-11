import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrencyService } from '@spartacus/core';
import { CurrentProductService, ProductDetailsTabComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaProduct, TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-product-details-tab',
  templateUrl: './tma-product-details-tab.component.html',
  styleUrls: ['./tma-product-details-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaProductDetailsTabComponent extends ProductDetailsTabComponent implements OnInit {

  product$: Observable<TmaProduct>;
  currency$: Observable<string>;

  constructor(
    public priceService: TmaPriceService,
    protected currentProductService: CurrentProductService,
    protected currencyService: CurrencyService
  ) {
    super(currentProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
  }

  /**
   * Checks if recurring or usage charge prices exist in the list of prices.
   *
   * @param priceList List containing all prices of a product
   * @return a value indicating if the contract term should be displayed or not
   */
  isContractTermDisplayNeeded(priceList: TmaProductOfferingPrice[]): boolean {
    if (!priceList || priceList.length === 0) {
      return false;
    }

    return !!priceList.find((pop: TmaProductOfferingPrice) => pop.chargeType === 'recurring' || pop.chargeType === 'usage');
  }
}
