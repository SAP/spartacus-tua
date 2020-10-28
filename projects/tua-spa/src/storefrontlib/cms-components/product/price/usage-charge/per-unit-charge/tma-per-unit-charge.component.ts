import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaPriceService } from '../../../../../../core/product/facade';
import { TmaProductOfferingPrice } from '../../../../../../core/model';

@Component({
  selector: 'cx-per-unit-charge',
  templateUrl: './tma-per-unit-charge.component.html',
  styleUrls: ['./tma-per-unit-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPerUnitChargeComponent {
  @Input()
  price: TmaProductOfferingPrice;

  discount: number;

  constructor(public priceService: TmaPriceService) {}

  availableDiscount(discounts: number): void {
    this.discount = discounts;
  }
}
