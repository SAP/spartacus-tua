import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../../core/model';
import { TmaPriceService } from '../../../../../../core/product/facade';

@Component({
  selector: 'cx-per-unit-charge',
  templateUrl: './tma-per-unit-charge.component.html',
  styleUrls: ['./tma-per-unit-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPerUnitChargeComponent {

  @Input()
  isListingAreaDisplay: boolean;

  @Input()
  isListMode: boolean;

  @Input()
  priceList: TmaProductOfferingPrice[];

  constructor(
    public priceService: TmaPriceService
  ) {
  }
}

