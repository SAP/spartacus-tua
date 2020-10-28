import { Component, OnInit, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model';
import { TmaCartPriceService } from '../../../../../../core';
import { LOCAL_STORAGE } from '../../../../../../core';
const {
  EACH_RESPECTIVE_TIER,
  HIGHEST_APPLICABLE_TIER
} = LOCAL_STORAGE.USAGE_TYPE;

interface TmaPriceMap {
  [key: string]: TmaCartPrice[];
}

@Component({
  selector: 'cx-cart-item-usage-charge',
  templateUrl: './cart-item-usage-charge.component.html',
  styleUrls: ['./cart-item-usage-charge.component.scss']
})
export class CartItemUsageChargeComponent implements OnInit {
  @Input()
  usageCharge: TmaCartPrice[];

  discount: number;
  showMore: boolean;
  eachRespectiveTierPriceList: TmaCartPrice[] = [];
  highestApplicableTierPriceList: TmaCartPrice[] = [];
  groupHighestApplicableTierPriceList: TmaPriceMap[];
  groupEachRespectiveTierPriceList: TmaPriceMap[];
  usagePriceList: TmaCartPrice[] = [];

  constructor(public cartPriceService: TmaCartPriceService) {}

  ngOnInit() {
    this.sortCartUsageCharges(this.usageCharge);
  }

  availableDiscount(discounts: number): void {
    this.discount = discounts;
  }

  /**
   * Sort usage changes based on usage types
   *
   * @param usageCharges - Cart usage charges
   */
  public sortCartUsageCharges(usageCharges: TmaCartPrice[]): void {
    let usageCharge;
    for (usageCharge of Object.values(usageCharges)) {
      usageCharge.forEach((cartPrice: TmaCartPrice) => {
        if (cartPrice.usageChargeType === undefined) {
          this.usagePriceList.push(cartPrice);
        }
        if (cartPrice.usageChargeType === EACH_RESPECTIVE_TIER) {
          this.eachRespectiveTierPriceList.push(cartPrice);
          this.groupEachRespectiveTierPriceList = this.getPriceGroupById(
            this.eachRespectiveTierPriceList
          );
        }
        if (cartPrice.usageChargeType === HIGHEST_APPLICABLE_TIER) {
          this.highestApplicableTierPriceList.push(cartPrice);
          this.groupHighestApplicableTierPriceList = this.getPriceGroupById(
            this.highestApplicableTierPriceList
          );
        }
      });
    }
  }

  /**
   * This method groups usage charges based on usageChargeType
   *
   * @param priceList - Cart prices
   *
   * @returns Grouped usage changes based on usageChargeType
   */
  protected getPriceGroupById(priceList: TmaCartPrice[]): TmaPriceMap[] {
    return priceList.reduce((groupReducedValues, { usageChargeType }) => {
      if (
        !groupReducedValues.some(
          (price: TmaCartPrice) => price.usageChargeType === usageChargeType
        )
      ) {
        groupReducedValues.push({
          usageChargeType,
          groupItem: priceList.filter(
            (price: TmaCartPrice) => price.usageChargeType === usageChargeType
          )
        });
      }
      return groupReducedValues;
    }, []);
  }
}
