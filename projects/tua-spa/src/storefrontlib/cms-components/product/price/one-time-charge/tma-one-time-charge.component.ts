import { Component, Input } from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../core/model';

@Component({
  selector: 'cx-one-time-charge',
  templateUrl: './tma-one-time-charge.component.html'
})
export class TmaOneTimeChargeComponent {

  @Input()
  oneTimeCharge: TmaProductOfferingPrice;

  constructor() {
  }

}
