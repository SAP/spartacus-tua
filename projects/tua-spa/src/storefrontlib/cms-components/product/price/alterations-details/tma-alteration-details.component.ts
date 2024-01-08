import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from "@angular/core";
import { TmaProductOfferingPrice } from '../../../../../core/model';

@Component({
  selector: "cx-alteration-details",
  templateUrl: "./tma-alteration-details.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaAlterationDetailsComponent {
  @Input()
  alteration: TmaProductOfferingPrice;

  constructor() {}

}
