import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  LogicalResourceType,
  TmaCharacteristic
} from '../../../../../core/model';

@Component({
  selector: 'cx-cart-item-configurable-pscv-display',
  templateUrl: './tma-cart-item-configurable-pscv-display.component.html',
  styleUrls: ['./tma-cart-item-configurable-pscv-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartItemConfigurablePscvDisplayComponent implements OnInit {
  @Input()
  characterstics: TmaCharacteristic[];
  groupedCharacterstics: TmaCharacteristic[] = [];
  constructor() {}

  ngOnInit(): void {
    const groupedResults = this.groupBy(
      this.characterstics.filter(
        (characteristic: TmaCharacteristic) =>
          characteristic.name !== LogicalResourceType.MSISDN
      ),
      'name'
    );
    this.groupedCharacterstics = Object.values(groupedResults);
  }

  protected groupBy(list: any[], field: string): any {
    return list.reduce(function (l: any[], f: string) {
      (l[f[field]] = l[f[field]] || []).push(f);
      return l;
    }, {});
  }
}
