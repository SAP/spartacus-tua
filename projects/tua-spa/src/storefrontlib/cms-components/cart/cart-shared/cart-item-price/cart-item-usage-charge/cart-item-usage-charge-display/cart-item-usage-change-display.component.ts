import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { TmaCartPriceService } from '../../../../../../../core';
import { TmaCartPrice } from '../../../../../../../core/model';
import { Observable } from 'rxjs';
import { CurrencyService } from '@spartacus/core';

@Component({
  selector: 'cx-cart-item-usage-charge-display',
  templateUrl: './cart-item-usage-change-display.component.html',
  styleUrls: ['./cart-item-usage-change-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemUsageChangeDisplayComponent implements OnInit {
  @Input()
  price: TmaCartPrice;

  discount: number;
  currency$: Observable<string>;

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.currency$ = this.currencyService.getActive();
  }

  availableDiscount(discounts: number): void {
    this.discount = discounts;
  }
}
