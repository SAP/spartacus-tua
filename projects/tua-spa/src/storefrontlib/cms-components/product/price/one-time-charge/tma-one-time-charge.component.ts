import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';
import { Observable } from 'rxjs';
import { CurrencyService } from '@spartacus/core';

@Component({
  selector: 'cx-one-time-charge',
  templateUrl: './tma-one-time-charge.component.html',
  styleUrls: ['./tma-one-time-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaOneTimeChargeComponent implements OnInit {

  @Input()
  isMainAreaDisplay: boolean;

  @Input()
  priceList: TmaProductOfferingPrice[];

  currency$: Observable<string>;

  constructor(
    public priceService: TmaPriceService,
    protected currencyService: CurrencyService,
  ) {
  }

  ngOnInit(): void {
    this.currency$ = this.currencyService.getActive();
  }
}
