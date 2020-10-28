import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';
import { LOCAL_STORAGE } from '../../../../../core';

const {
  EACH_RESPECTIVE_TIER,
  HIGHEST_APPLICABLE_TIER
} = LOCAL_STORAGE.USAGE_TYPE;
interface TmaPriceMap {
  [key: string]: TmaProductOfferingPrice[];
}
@Component({
  selector: 'cx-usage-charge',
  templateUrl: './tma-usage-charge.component.html',
  styleUrls: ['./tma-usage-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaUsageChargeComponent implements OnInit {
  @Input()
  usageChargeList: TmaPriceMap[];

  groupHighestApplicableTierPriceList: TmaPriceMap[];
  groupEachRespectiveTierPriceList: TmaPriceMap[];
  usagePriceList: TmaProductOfferingPrice[] = [];
  eachRespectiveTierPriceList: TmaProductOfferingPrice[] = [];
  highestApplicableTierPriceList: TmaProductOfferingPrice[] = [];

  constructor(public priceService: TmaPriceService) {}

  ngOnInit(): void {
    this.sortUsageCharges(this.usageChargeList);
  }

  /**
   * Sort the usage changes based on usage type
   *
   * @param usageCharges - Product usage changes
   */
  public sortUsageCharges(usageCharges: TmaPriceMap[]): void {
    let usageCharge;
    for (usageCharge of Object.values(usageCharges)) {
      usageCharge.forEach((productOfferingPrice: TmaProductOfferingPrice) => {
        if (productOfferingPrice.usageType === undefined) {
          this.usagePriceList.push(productOfferingPrice);
        }
        if (productOfferingPrice.usageType === EACH_RESPECTIVE_TIER) {
          this.eachRespectiveTierPriceList.push(productOfferingPrice);
          this.groupEachRespectiveTierPriceList = this.getPriceGroupById(
            this.eachRespectiveTierPriceList
          );
        }
        if (productOfferingPrice.usageType === HIGHEST_APPLICABLE_TIER) {
          this.highestApplicableTierPriceList.push(productOfferingPrice);
          this.groupHighestApplicableTierPriceList = this.getPriceGroupById(
            this.highestApplicableTierPriceList
          );
        }
      });
    }
  }

   /**
   * This method groups usage charges based on id
   *
   * @param priceList - Product offering prices
   *
   * @returns Grouped usage changes based on id
   */
  protected getPriceGroupById(
    priceList: TmaProductOfferingPrice[]
  ): TmaPriceMap[] {
    return priceList.reduce((groupReducedValues, { id }) => {
      if (
        !groupReducedValues.some(
          (price: TmaProductOfferingPrice) => price.id === id
        )
      ) {
        groupReducedValues.push({
          id,
          groupItem: priceList.filter(
            (price: TmaProductOfferingPrice) => price.id === id
          )
        });
      }
      return groupReducedValues;
    }, []);
  }
}
