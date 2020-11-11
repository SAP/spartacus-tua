import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../../core/model';
import { TmaPriceService } from '../../../../../../core/product/facade';

@Component({
  selector: 'cx-volume-charge',
  templateUrl: './tma-volume-charge.component.html',
  styleUrls: ['./tma-volume-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaVolumeChargeComponent {

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
