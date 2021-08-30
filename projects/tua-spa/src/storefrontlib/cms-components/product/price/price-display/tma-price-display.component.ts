import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from '@spartacus/core';
import { TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-price-display',
  templateUrl: './tma-price-display.component.html',
  styleUrls: ['./tma-price-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPriceDisplayComponent implements OnInit, OnChanges {

  @Input()
  price: TmaProductOfferingPrice;

  list: TmaProductOfferingPrice[] = [];

  currency$: Observable<string>;

  constructor(
    public priceService: TmaPriceService,
    protected currencyService: CurrencyService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnChanges() {
    this.list = [];
    if(this.price) {
      this.list.push(this.price);
    }
  }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    if(this.price) {
      this.list.push(this.price);
    }
  }

  getSortedList(list: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    const newList: TmaProductOfferingPrice[] = [];
    const bundledPops = list.filter((price: TmaProductOfferingPrice) => price.bundledPop);
    const oneTimeCharges = list.filter((price: TmaProductOfferingPrice) => price.chargeType === 'oneTime');
    const recurringCharges = list.filter((price: TmaProductOfferingPrice) => price.chargeType === 'recurring');
    const usageCharges = list.filter((price: TmaProductOfferingPrice) => price.chargeType === 'usage');
    const discountCharges = list.filter((price: TmaProductOfferingPrice) => price.chargeType === 'discount');

    bundledPops.forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));

    oneTimeCharges.forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));
    recurringCharges.sort((a, b) => (Number(a.cycle.cycleStart) > Number(b.cycle.cycleStart)) ? 1 : -1)
      .forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));
    usageCharges.sort((x, y) =>
      (x.unitOfMeasure > y.unitOfMeasure ? 1 : (x.unitOfMeasure === y.unitOfMeasure ?
        ((Number(x.tierStart) > Number(y.tierStart) || x.tierStart === undefined) ? 1 : -1) : -1)))
      .forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));

    discountCharges.forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));

    return newList;
  }
}
