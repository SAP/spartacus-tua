import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { TmaCartPrice } from '../../../../../core/model';
import { TmaCartPriceService } from '../../../../../core';

@Component({
  selector: 'cx-cart-item-price-display',
  templateUrl: './tma-cart-item-price-display.component.html',
  styleUrls: ['./tma-cart-item-price-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartItemPriceDisplayComponent implements OnInit {
  @Input()
  price: TmaCartPrice;

  list: TmaCartPrice[] = [];

  currency$: Observable<string>;

  constructor(public priceService: TmaCartPriceService) {}

  ngOnInit(): void {
    this.list.push(this.price.cartPrice[0]);
  }

  getSortedList(list:TmaCartPrice[]): TmaCartPrice[] {
    const newList:TmaCartPrice[]= [];
    const bundledPops = list.filter((price:TmaCartPrice)=> price.cartPrice);
    const oneTimeCharges = list.filter((price:TmaCartPrice)=> price.chargeType ==='oneTime');
    const recurringCharges = list.filter((price:TmaCartPrice)=> price.chargeType ==='recurring');
    const usageCharges = list.filter((price:TmaCartPrice)=> price.chargeType ==='usage');
    const discountCharges = list.filter((price:TmaCartPrice)=> price.chargeType ==='discount');
    bundledPops.forEach((bundlePop:TmaCartPrice)=> newList.push(bundlePop));
    oneTimeCharges.forEach((bundlePop:TmaCartPrice)=> newList.push(bundlePop));
    recurringCharges.sort((a, b) => (Number(a.cycle.cycleStart) > Number(b.cycle.cycleStart)) ? 1 : -1).forEach((bundlePop:TmaCartPrice)=> newList.push(bundlePop));
    usageCharges.sort((x, y) =>
      (x.unitOfMeasure > y.unitOfMeasure ? 1 : (x.unitOfMeasure === y.unitOfMeasure ?
        ((Number(x.tierStart) > Number(y.tierStart) || x.tierStart === undefined) ? 1 : -1) : -1))).forEach((bundlePop:TmaCartPrice)=> newList.push(bundlePop));
    discountCharges.forEach((bundlePop:TmaCartPrice)=> newList.push(bundlePop));
    return newList;
  }
}
