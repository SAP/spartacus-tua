import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from '@spartacus/core';
import { TmaMoney, TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-price-display',
  templateUrl: './tma-price-display.component.html',
  styleUrls: ['./tma-price-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPriceDisplayComponent implements OnInit {
  @Input()
  priceList: TmaProductOfferingPrice[];

  @Input()
  price: TmaProductOfferingPrice;

  @Input()
  list: boolean;

  @Output()
  availableDiscount = new EventEmitter<number>();

  currency$: Observable<string>;
  chargesSum: string;
  discountedPrice: string;
  discountExist: boolean;
  discountPrice: TmaMoney;

  constructor(
    public priceService: TmaPriceService,
    protected currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.currency$ = this.currencyService.getActive();
    if (!this.list) {
      const listPrice: TmaProductOfferingPrice[] = [];
      listPrice.push(this.price);
      this.priceList = listPrice;
    }
      this.chargesSum = this.priceService.getFormattedPrice(
        this.priceService.sumOfCharges(this.priceList)
      );
      this.discountExist =
        this.priceService.getDiscounts(this.priceList).length > 0;
      if (this.discountExist) {
        this.discountPrice = this.priceService.calculatePrice(this.priceList);
        this.discountedPrice = this.priceService.getFormattedPrice(
          this.discountPrice
        );
      }
      this.availableDiscount.emit(
        this.priceService.calculateTotalDiscount(
          Number(this.priceService.sumOfCharges(this.priceList).value),
          this.discountPrice
            ? Number(this.discountPrice.value)
            : Number(this.priceService.sumOfCharges(this.priceList).value)
        )
      );
  }
}
