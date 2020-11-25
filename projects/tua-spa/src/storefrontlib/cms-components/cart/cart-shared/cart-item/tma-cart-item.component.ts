import {
  LogicalResource,
  LogicalResourceType,
  TmaCharacteristic,
  TmaCartPrice,
  TmaSubscribedProduct,
  Appointment
} from '../../../../../core/model';
import { Component, Input, OnInit } from '@angular/core';
import {
  CartItemComponent,
  Item,
  PromotionService
} from '@spartacus/storefront';
import { CurrencyService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaCartPriceService } from '../../../../../core/cart/facade';
import { LogicalResourceReservationService } from '../../../../../core/reservation';

export interface TmaItem extends Item {
  entryNumber?: number;
  subscribedProduct?: TmaSubscribedProduct;
  cartPrice?: TmaCartPrice;
  entryGroupNumbers?: number[];
  rootBpoCode?: string;
  appointment?: Appointment;
}

@Component({
  selector: 'cx-cart-item',
  templateUrl: './tma-cart-item.component.html',
  styleUrls: ['./tma-cart-item.component.scss']
})
export class TmaCartItemComponent extends CartItemComponent implements OnInit {
  @Input()
  item: TmaItem;

  @Input()
  displayPrices = true;

  @Input()
  isRemovable: boolean;

  @Input()
  cartPage?: boolean;

  @Input()
  qtyDisabled = false;

  currency$: Observable<string>;
  itemLogicalResources: LogicalResource[];

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected currencyService: CurrencyService,
    protected promotionService: PromotionService,
    protected logicalResourceReservationService?: LogicalResourceReservationService
  ) {
    super(promotionService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
    this.itemLogicalResources = this.getLogicalResources(
      this.item.subscribedProduct.characteristic
    );
  }

  removeItem() {
    if (!!this.itemLogicalResources) {
      this.logicalResourceReservationService.clearInvalidReservations(
        this.itemLogicalResources
      );
    }
    super.removeItem();
  }

  protected getLogicalResources(
    characteristics: TmaCharacteristic[]
  ): LogicalResource[] {
    const logicalResources: LogicalResource[] = [];
    if (!characteristics) {
      return;
    }
    characteristics.forEach((characteristic: TmaCharacteristic) => {
      if (
        !!characteristic.name &&
        Object.values(LogicalResourceType).includes(
          LogicalResourceType[characteristic.name.toUpperCase()]
        )
      ) {
        const logicalResource: LogicalResource = {};
        logicalResource.type =
          LogicalResourceType[characteristic.name.toUpperCase()];
        logicalResource.value = characteristic.value;
        logicalResources.push(logicalResource);
      }
    });
    return logicalResources;
  }
}
