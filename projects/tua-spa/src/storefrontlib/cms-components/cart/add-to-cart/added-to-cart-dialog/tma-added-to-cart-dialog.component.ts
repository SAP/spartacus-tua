import {
  AddedToCartDialogComponent,
  ModalService,
  PromotionService
} from '@spartacus/storefront';
import { Component, Input, OnInit } from '@angular/core';
import {
  TmaCartPriceService,
  TmaCartService,
  LOCAL_STORAGE,
  TmaProcessTypeEnum
} from '../../../../../core';
import { CurrencyService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaItem } from '../../cart-shared';

@Component({
  selector: 'cx-added-to-cart-dialog',
  templateUrl: './tma-added-to-cart-dialog.component.html',
  styleUrls: ['./tma-added-to-cart-dialog.component.scss']
})
export class TmaAddedToCartDialogComponent
  extends AddedToCartDialogComponent
  implements OnInit {
  @Input()
  hasPremise: boolean;

  currency$: Observable<string>;

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected modalService: ModalService,
    protected cartService: TmaCartService,
    protected currencyService: CurrencyService,
    protected promotionService: PromotionService
  ) {
    super(modalService, cartService, promotionService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
  }

 /**
   * Get the retention process type.
   *
   *  @return Retention process type as a {@link string}
   *  @deprecated since tua-spa 3.2
   */
  getRetentionProcessType(): string {
    return TmaProcessTypeEnum.RETENTION;
  }

  /**
   * Get the renewal process type.
   *
   *  @return Renewal process type as a {@link string}
   */
  getRenewalProcessType(): string {
    return TmaProcessTypeEnum.RENEWAL;
  }
}
