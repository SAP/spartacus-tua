import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { CurrencyService } from '@spartacus/core';
import { TmaPriceService } from '../../../../../core/product/facade';
import { Observable } from 'rxjs';
import { TmaProductOfferingPrice } from '../../../../../core/model';

@Component({
  selector: 'cx-product-list-price',
  templateUrl: './tma-product-list-price.component.html',
  styleUrls: ['./tma-product-list-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaProductListPriceComponent implements OnInit {

  @Input()
  compositePricingList: TmaProductOfferingPrice[];

  currency$: Observable<string>;
  discount: number;

  constructor(
    public priceService: TmaPriceService,
    protected currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.currency$ = this.currencyService.getActive();
  }

  availableDiscount(discounts: number): void {
    this.discount = discounts;
  }
}
