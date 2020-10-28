import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaPriceService } from '../../../../../../core/product/facade';
import { TmaProductOfferingPrice } from '../../../../../../core/model';

@Component({
  selector: 'cx-volume-charge',
  templateUrl: './tma-volume-charge.component.html',
  styleUrls: ['./tma-volume-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaVolumeChargeComponent {

  @Input()
  priceList: TmaProductOfferingPrice[];

  constructor(
    public priceService: TmaPriceService
  ) {
  }
}
