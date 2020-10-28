import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from '@spartacus/core';

@Component({
  selector: 'cx-discount-display',
  templateUrl: './tma-discount-display.component.html',
  styleUrls: ['./tma-discount-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaDiscountDisplayComponent implements OnInit {
  @Input()
  discount: number;

  currency$: Observable<string>;

  constructor(protected currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currency$ = this.currencyService.getActive();
  }
}
