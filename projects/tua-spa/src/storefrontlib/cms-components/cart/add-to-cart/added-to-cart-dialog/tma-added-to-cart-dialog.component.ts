import {
  AddedToCartDialogComponent,
  ModalService,
  PromotionService,
} from '@spartacus/storefront';
import { Component, Input, OnInit } from '@angular/core';
import { TmaCartPriceService, TmaCartService, LOCAL_STORAGE, TmaProcessTypeEnum } from '../../../../../core';
import { CurrencyService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaItem } from '../../cart-shared';

@Component({
  selector: 'cx-added-to-cart-dialog',
  templateUrl: './tma-added-to-cart-dialog.component.html',
  styleUrls: ['./tma-added-to-cart-dialog.component.scss'],
})
export class TmaAddedToCartDialogComponent extends AddedToCartDialogComponent implements OnInit {
  
  @Input()
  hasPremise: boolean;

  currency$: Observable<string>;
  appointmentEntries: TmaItem[] = [];

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
  entryHaveInstallationDetails(item: TmaItem): boolean {
    let hasAppointment = false;
    if (item.appointment !== undefined || (item.subscribedProduct !==null && item.subscribedProduct.place !==null)) {
      hasAppointment = true;
      this.appointmentEntries.push(item);
    }
    return hasAppointment;
  }

  /**
   *  Get the retention process type.
   * 
   *  @return Retention process type as a {@link string}
   */
  getRetentionProcessType(): string{
    return TmaProcessTypeEnum.RETENTION;
  }
}
