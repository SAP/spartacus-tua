import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
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

  @Input()
  list: boolean;

  @Output()
  availableDiscount = new EventEmitter<number>();

  currency$: Observable<string>;
  chargesSum: string;
  discountedPrice: string;
  discountExist: boolean;

  constructor(public priceService: TmaCartPriceService) {}

  ngOnInit(): void {
    this.chargesSum = this.priceService.getFormattedPrice(
      this.price.taxIncludedAmount
    );
    const offerPrice = this.priceService.calculatePrice(this.price);
    if (offerPrice.value < this.price.taxIncludedAmount.value) {
      this.discountExist = true;
    }
    this.discountedPrice = this.priceService.getFormattedPrice(
      this.priceService.calculatePrice(this.price)
    );
    this.availableDiscount.emit(
      this.priceService.calculateTotalDiscount(
        this.price.taxIncludedAmount.value,
        offerPrice.value
      )
    );
  }
}
