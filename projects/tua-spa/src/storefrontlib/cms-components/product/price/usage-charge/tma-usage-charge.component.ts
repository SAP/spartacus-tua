import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../core/model';

interface TmaPriceMap {
  [key: string]: TmaProductOfferingPrice[];
}

@Component({
  selector: 'cx-usage-charge',
  templateUrl: './tma-usage-charge.component.html',
  styleUrls: ['./tma-usage-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaUsageChargeComponent {

  @Input()
  eachRespectiveTierUcList: TmaPriceMap[];

  @Input()
  highestApplicableTierUcList: TmaPriceMap[];

  @Input()
  notApplicableUcList: TmaPriceMap[];

  @Input()
  volumeChargeList: TmaPriceMap[];

  @Input()
  isListingAreaDisplay: boolean;

  @Input()
  isListMode: boolean;

  constructor() {
  }
}
