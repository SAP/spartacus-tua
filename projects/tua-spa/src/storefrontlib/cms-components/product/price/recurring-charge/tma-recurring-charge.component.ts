import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaProductOfferingPrice, TmaProductOfferingTerm, TmaQuantity } from '../../../../../core/model';
import { TmaBillingFrequencyConfig, TmaBillingFrequencyMap } from '../../../../../core/billing-frequency/config';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-recurring-charge',
  templateUrl: './tma-recurring-charge.component.html',
  styleUrls: ['./tma-recurring-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaRecurringChargeComponent {

  @Input()
  recurringChargeList: TmaProductOfferingPrice[];

  @Input()
  contractTerm: TmaProductOfferingTerm;

  constructor(
    public priceService: TmaPriceService,
    protected billingFrequencyConfig: TmaBillingFrequencyConfig,
  ) {
  }

  getGroupedRecurringChargeList(priceList: TmaProductOfferingPrice[], contractTerm: TmaProductOfferingTerm): TmaProductOfferingPrice[] {
    if (!priceList || priceList.length === 0 || !contractTerm || !contractTerm.duration || contractTerm.duration.amount == null) {
      return [];
    }

    const perMonthPriceList: number[] = [];

    const contractTermDurationInMonths = this.getContractTermDurationInMonths(contractTerm.duration);

    for (let i = 1; i <= contractTermDurationInMonths; i++) {
      perMonthPriceList.push(priceList
        .filter((price: TmaProductOfferingPrice) =>
          !price.cycle ||
          !price.cycle.cycleStart ||
          (price.cycle.cycleStart <= i && (!price.cycle.cycleEnd || price.cycle.cycleEnd >= i || price.cycle.cycleEnd === -1)))
        .reduce(function (accumulator: number, pop: TmaProductOfferingPrice) {
          return accumulator + Number(pop.price.value);
        }, 0));
    }

    const currency: string = priceList
      .find((pop: TmaProductOfferingPrice) => pop && pop.price && pop.price.currencyIso).price.currencyIso;
    const recurringChargePeriodType: string = priceList
      .find((pop: TmaProductOfferingPrice) => pop && pop.recurringChargePeriodType).recurringChargePeriodType;

    const groupedRecurringChargeList: TmaProductOfferingPrice[] = [];
    let currentPrice = perMonthPriceList[0];
    let cycleStart = 1;
    for (let i = 0; i < perMonthPriceList.length; i++) {
      if (i + 1 === perMonthPriceList.length) {
        groupedRecurringChargeList.push({
          price: {
            value: currentPrice.toString(),
            currencyIso: currency,
          },
          cycle: {
            cycleStart: cycleStart,
            cycleEnd: i + 1,
          },
          recurringChargePeriodType: recurringChargePeriodType,
        });
        break;
      }

      if (currentPrice !== perMonthPriceList[i + 1]) {
        groupedRecurringChargeList.push({
          price: {
            value: currentPrice.toString(),
            currencyIso: currency,
          },
          cycle: {
            cycleStart: cycleStart,
            cycleEnd: i + 1,
          },
          recurringChargePeriodType: recurringChargePeriodType,
        });
        currentPrice = perMonthPriceList[i + 1];
        cycleStart = i + 2;
      }
    }

    return groupedRecurringChargeList;
  }

  getPeriodType(contractTerm: TmaProductOfferingTerm): string {
    if (!contractTerm || !contractTerm.billingPlan || !contractTerm.billingPlan.billingTime) {
      return 'month';
    }

    const periodType: string = contractTerm.billingPlan.billingTime.replace(/ly$/, '');
    return periodType.toLowerCase();
  }

  getCycleDuration(price: TmaProductOfferingPrice, contractTerm: TmaProductOfferingTerm): number {
    if (price && price.cycle && price.cycle.cycleStart) {
      if (price.cycle.cycleEnd && price.cycle.cycleEnd !== -1) {
        return price.cycle.cycleEnd - price.cycle.cycleStart + 1;
      }

      if (contractTerm && contractTerm.duration && contractTerm.duration.amount) {
        return contractTerm.duration.amount - price.cycle.cycleStart + 1;
      }
      return 0;
    }
    return 0;
  }

  protected getContractTermDurationInMonths(contractTermDuration: TmaQuantity): number {
    if (!contractTermDuration || !contractTermDuration.amount || !contractTermDuration.units) {
      return 1;
    }

    const contractTermUnitInMonths: TmaBillingFrequencyMap = this.billingFrequencyConfig.billingFrequency
      .find((billingFrequencyMap: TmaBillingFrequencyMap) => billingFrequencyMap.key === contractTermDuration.units);

    return contractTermUnitInMonths ? contractTermDuration.amount * contractTermUnitInMonths.value : contractTermDuration.amount;
  }
}
