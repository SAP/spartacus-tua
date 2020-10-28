import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaBillingFrequencyConfig } from '../../../../../core/billing-frequency/config';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-recurring-charge',
  templateUrl: './tma-recurring-charge.component.html',
  styleUrls: ['./tma-recurring-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaRecurringChargeComponent {
  @Input()
  recurringCharges: TmaProductOfferingPrice[];

  discount: number;

  constructor(
    public priceService: TmaPriceService,
    protected billingFrequencyConfig: TmaBillingFrequencyConfig
  ) {}

  availableDiscount(discounts: number): void {
    this.discount = discounts;
  }
}
