import { Injectable, OnDestroy } from '@angular/core';
import { TranslationService } from '@spartacus/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { TmaBillingFrequencyConfig, TmaBillingFrequencyMap } from '../../config/billing-frequency/config';
import {
  TmaItemType,
  TmaMoney,
  TmaPopBillingEventType,
  TmaPopChargeType,
  TmaProduct,
  TmaProductOfferingPrice,
  TmaProductOfferingTerm,
  TmaProductSpecificationCharacteristicValue,
  TmaUsageType,
  TmaUsageUnit
} from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaPriceService implements OnDestroy {

  protected readonly ID: string = 'id';

  protected allPrices = [];

  protected destroyed$ = new Subject();

  constructor(
    protected billingFrequencyConfig: TmaBillingFrequencyConfig,
    protected translationService: TranslationService
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns the minimum price of a product.
   *
   * @param product - The product for which the minimum price will be returned
   * @return A {@link TmaProductOfferingPrice}
   */
  getMinimumPrice(product: TmaProduct): TmaProductOfferingPrice {
    let minimumPrice: TmaProductOfferingPrice = null;

    if (!product || !product.productOfferingPrice) {
      return minimumPrice;
    }

    if (product.productOfferingPrice.length === 1) {
      return product.productOfferingPrice[0];
    }

    minimumPrice = product.productOfferingPrice[0];

    product.productOfferingPrice.forEach((pop: TmaProductOfferingPrice) => {
      if (this.compareInstances(minimumPrice, pop) > 0) {
        minimumPrice = pop;
      }
    });

    return minimumPrice;
  }

  /**
   * Flattens the prices of a product and returns them in a list.
   *
   * @param price - The price which will be flattened
   * @return List of {@link TmaProductOfferingPrice}
   */
  getAllPriceList(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    this.allPrices = [];
    this.flattenPriceTree(price, null);
    return this.allPrices;
  }

  /**
   * Returns a list containing only the cancellation fee prices.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} cancellation fees
   */
  getCancellationFeePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === TmaPopBillingEventType.ON_CANCELLATION) :
      [];
  }

  /**
   * Returns a list containing only the pay now prices.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} pay now prices
   */
  getPayNowPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === TmaPopBillingEventType.PAY_NOW) : [];
  }

  /**
   * Returns a list containing only the on first bill prices.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} on first bill prices
   */
  getOnFirstBillPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === TmaPopBillingEventType.ON_FIRST_BILL) :
      [];
  }

  /**
   * Returns a list containing only the one time charges.
   *
   * @param price - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} one time charges
   */
  getOneTimeCharges(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    return price && price.bundledPop && price.bundledPop.length !== 0 ?
      price.bundledPop.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.ONE_TIME) : [];
  }

  /**
   * Returns a list containing only the recurring charges.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} recurring charges
   */
  getRecurringPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.RECURRING)
        .sort((s1, s2) => {
          if (!s1.cycle || !s1.cycle.cycleEnd) {
            return 1;
          }
          if (!s2.cycle || !s2.cycle.cycleEnd) {
            return -1;
          }
          if (s1.cycle.cycleEnd === -1) {
            return 1;
          }
          if (s2.cycle.cycleEnd === -1) {
            return -1;
          }
          if (s1.cycle.cycleEnd < s2.cycle.cycleEnd) {
            return -1;
          }
          return 1;
        })
        .sort((s1, s2) => {
          if (!s1.cycle || !s1.cycle.cycleStart) {
            return 1;
          }
          if (!s2.cycle || !s2.cycle.cycleStart) {
            return 1;
          }
          if (s1.cycle.cycleStart < s2.cycle.cycleStart) {
            return -1;
          }
          return 1;
        }) :
      [];
  }

  /**
   * Returns a list containing only the each respective tier usage charges.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} each respective tier usage charges
   */
  getEachRespectiveTierUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
      .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE)
      .filter((unitPrice: TmaProductOfferingPrice) => unitPrice.usageType === TmaUsageType.EACH_RESPECTIVE_TIER)
      .sort((s1, s2) => {
        if (!s1.tierEnd) {
          return 1;
        }
        if (!s2.tierEnd) {
          return -1;
        }
        if (s1.tierEnd < s2.tierEnd) {
          return -1;
        }
        return 1;
      })
      .sort((s1, s2) => {
        if (!s1.tierStart) {
          return 1;
        }
        if (!s2.tierStart) {
          return -1;
        }
        if (s1.tierStart < s2.tierStart) {
          return -1;
        }
        return 1;
      }), this.ID) :
      [];
  }

  /**
   * Returns a list containing only the highest respective tier usage charges.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} highest respective tier usage charges
   */
  getHighestApplicableTierUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
      .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE)
      .filter((unitPrice: TmaProductOfferingPrice) => unitPrice.usageType === TmaUsageType.HIGHEST_APPLICABLE_TIER)
      .sort((s1, s2) => {
        if (!s1.tierEnd) {
          return 1;
        }
        if (!s2.tierEnd) {
          return -1;
        }
        if (s1.tierEnd < s2.tierEnd) {
          return -1;
        }
        return 1;
      })
      .sort((s1, s2) => {
        if (!s1.tierStart) {
          return 1;
        }
        if (!s2.tierStart) {
          return -1;
        }
        if (s1.tierStart < s2.tierStart) {
          return -1;
        }
        return 1;
      }), this.ID) :
      [];
  }

  /**
   * Returns a list containing only the per unit usage charges which don't have a usageType defined.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} per unit usage charges which don't have a usageType defined
   */
  getNotApplicableUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
      .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE && bundledPop.itemType === TmaItemType.PER_UNIT_USAGE_CHARGE)
      .filter((unitPrice: TmaProductOfferingPrice) => !unitPrice.usageType || unitPrice.usageType === '')
      .sort((s1, s2) => {
        if (!s1.tierEnd) {
          return 1;
        }
        if (!s2.tierEnd) {
          return -1;
        }
        if (s1.tierEnd < s2.tierEnd) {
          return -1;
        }
        return 1;
      })
      .sort((s1, s2) => {
        if (!s1.tierStart) {
          return 1;
        }
        if (!s2.tierStart) {
          return -1;
        }
        if (s1.tierStart < s2.tierStart) {
          return -1;
        }
        return 1;
      }), this.ID) :
      [];
  }

  /**
   * Returns a list containing only the volume usage charges.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} volume usage charges
   */
  getVolumeUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
      .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE && bundledPop.itemType === TmaItemType.VOLUME_USAGE_CHARGE)
      .sort((s1, s2) => {
        if (!s1.tierEnd) {
          return 1;
        }
        if (!s2.tierEnd) {
          return -1;
        }
        if (s1.tierEnd < s2.tierEnd) {
          return -1;
        }
        return 1;
      })
      .sort((s1, s2) => {
        if (!s1.tierStart) {
          return 1;
        }
        if (!s2.tierStart) {
          return -1;
        }
        if (s1.tierStart < s2.tierStart) {
          return -1;
        }
        return 1;
      }), this.ID) :
      [];
  }

  /**
   * Returns the contract term of the price provided.
   *
   * @param price - The price of the product
   * @return The product offering term of the price
   */
  getContractTerm(price: TmaProductOfferingPrice): TmaProductOfferingTerm {
    if (!price || !price.productOfferingTerm || price.productOfferingTerm.length === 0) {
      return null;
    }

    return price.productOfferingTerm[0];
  }

  /**
   * Returns the average cost per month based on the consumption and term provided.
   *
   * @param product - The product for which the average cost per month will be returned
   * @param currency - The currency of the price
   * @param consumption - The consumption for which the average cost per month will be computed
   * @param term - The duration of te contract
   * @return A {@link TmaMoney} containing the average cost per month
   */
  getAverageCostPerMonth(product: TmaProduct, currency: string, consumption: number, term: number): TmaMoney {
    const minimumPrice = this.getMinimumPrice(product);
    const priceList = this.getAllPriceList(minimumPrice);

    const onFirstBillOneTimeChargePriceList = this.getOnFirstBillPrices(priceList);
    const onCancellationOneTimeChargePriceList = this.getCancellationFeePrices(priceList);
    const payNowOneTimeChargePriceList = this.getPayNowPrices(priceList);
    const recurringChargePriceList = this.getRecurringPrices(priceList);
    const eachRespectiveTierUsageChargePriceList = this.getEachRespectiveTierUsagePrices(priceList);
    const highestApplicableTierUsageChargePriceList = this.getHighestApplicableTierUsagePrices(priceList);
    const notApplicableUsageChargePriceList = this.getNotApplicableUsagePrices(priceList);
    const volumeUsageChargePriceList = this.getVolumeUsagePrices(priceList);

    const contractTerm = this.getContractTerm(minimumPrice);

    if (!priceList || priceList.length === 0) {
      return { value: '0.0', currencyIso: currency };
    }

    let averageCost = 0;

    let oneTimeChargeValue = 0;
    onFirstBillOneTimeChargePriceList.forEach((childPrice: TmaProductOfferingPrice) => oneTimeChargeValue += Number(childPrice.price.value));
    onCancellationOneTimeChargePriceList.forEach((childPrice: TmaProductOfferingPrice) => oneTimeChargeValue += Number(childPrice.price.value));
    payNowOneTimeChargePriceList.forEach((childPrice: TmaProductOfferingPrice) => oneTimeChargeValue += Number(childPrice.price.value));

    let recurringChargeValue = 0;
    recurringChargePriceList.forEach((childPrice: TmaProductOfferingPrice) => {
      const cycleEnd = childPrice.cycle && childPrice.cycle.cycleEnd ? (childPrice.cycle.cycleEnd === -1 ?
        contractTerm.duration.amount : childPrice.cycle.cycleEnd) : contractTerm.duration.amount;
      recurringChargeValue += Number(childPrice.price.value) * (cycleEnd - childPrice.cycle.cycleStart + 1);
    });

    if (!consumption) {
      averageCost = (oneTimeChargeValue / contractTerm.duration.amount) + (recurringChargeValue / contractTerm.duration.amount);
      return { value: averageCost.toFixed(2).toString(), currencyIso: currency };
    }

    const billingFrequency: number = this.getBillingFrequency(contractTerm);
    const consumptionIncluded: number = this.getConsumptionIncludedInPlan(minimumPrice, product);
    const extraConsumption: number = consumption / (term / billingFrequency) - consumptionIncluded;

    if (extraConsumption <= 0) {
      averageCost = (oneTimeChargeValue / contractTerm.duration.amount) + (recurringChargeValue / contractTerm.duration.amount);
      return { value: averageCost.toFixed(2).toString(), currencyIso: currency };
    }

    let eachRespectiveTierValue = 0;
    Object.keys(eachRespectiveTierUsageChargePriceList).forEach((key: string) => {
      const maxTierForEachRespectiveTierPrice = eachRespectiveTierUsageChargePriceList[key].length !== 0 ?
        eachRespectiveTierUsageChargePriceList[key].reduce((prev, current) => {
          if (!current.tierEnd) {
            return prev;
          }
          if (prev.tierEnd > current.tierEnd) {
            return prev;
          }
          return current;
        }).tierEnd : 0;

      eachRespectiveTierUsageChargePriceList[key].forEach((childPrice: TmaProductOfferingPrice) => {
        if (Number(childPrice.tierStart) <= extraConsumption) {
          const consumptionForTier = (extraConsumption > Number(childPrice.tierEnd) ?
            (Number(childPrice.tierEnd) === -1 ? extraConsumption : Number(childPrice.tierEnd)) :
            extraConsumption) - Number(childPrice.tierStart) + 1;
          eachRespectiveTierValue += childPrice.price.value ? Number(childPrice.price.value) * consumptionForTier : 0;
        }
        if (!childPrice.tierStart && !childPrice.tierEnd) {
          const consumptionForTier = extraConsumption > maxTierForEachRespectiveTierPrice ?
            extraConsumption - maxTierForEachRespectiveTierPrice : 0;
          eachRespectiveTierValue += childPrice.price.value ? Number(childPrice.price.value) * consumptionForTier : 0;
        }
      });
    });

    eachRespectiveTierValue /= billingFrequency;

    let highestApplicableTierValue = 0;
    Object.keys(highestApplicableTierUsageChargePriceList).forEach((key: string) => {
      const maxTierForHighestApplicableTierPrice = highestApplicableTierUsageChargePriceList[key].length !== 0 ?
        highestApplicableTierUsageChargePriceList[key].reduce((prev, current) => {
          if (!current.tierEnd) {
            return prev;
          }
          if (prev.tierEnd > current.tierEnd) {
            return prev;
          }
          return current;
        }).tierEnd : 0;

      let priceForConsumption = highestApplicableTierUsageChargePriceList[key]
        .find((childPrice: TmaProductOfferingPrice) =>
          Number(childPrice.tierStart) <= extraConsumption && (Number(childPrice.tierEnd) >= extraConsumption || Number(childPrice.tierEnd) === -1));
      priceForConsumption = priceForConsumption ?
        priceForConsumption : extraConsumption > maxTierForHighestApplicableTierPrice ?
          highestApplicableTierUsageChargePriceList[key].find((childPrice: TmaProductOfferingPrice) => !childPrice.tierStart && !childPrice.tierEnd) :
          null;

      highestApplicableTierValue += priceForConsumption ? Number(priceForConsumption.price.value) * extraConsumption : 0;
    });

    highestApplicableTierValue /= billingFrequency;

    let notApplicablePriceValue = 0;
    Object.keys(notApplicableUsageChargePriceList).forEach((key: string) => {
      const maxTierForNotApplicablePrice = notApplicableUsageChargePriceList[key].length !== 0 ?
        notApplicableUsageChargePriceList[key].reduce((prev, current) => {
          if (!current.tierEnd) {
            return prev;
          }
          if (prev.tierEnd > current.tierEnd) {
            return prev;
          }
          return current;
        }).tierEnd : 0;

      notApplicableUsageChargePriceList[key].forEach((childPrice: TmaProductOfferingPrice) => {
        if (Number(childPrice.tierStart) <= extraConsumption) {
          const consumptionForTier = (extraConsumption > Number(childPrice.tierEnd) ?
            (Number(childPrice.tierEnd) === -1 ? extraConsumption : Number(childPrice.tierEnd)) :
            extraConsumption) - Number(childPrice.tierStart) + 1;
          notApplicablePriceValue += childPrice.price.value ? Number(childPrice.price.value) * consumptionForTier : 0;
        }
        if (!childPrice.tierStart && !childPrice.tierEnd) {
          const consumptionForTier = extraConsumption > maxTierForNotApplicablePrice ?
            extraConsumption - maxTierForNotApplicablePrice : 0;
          notApplicablePriceValue += childPrice.price.value ? Number(childPrice.price.value) * consumptionForTier : 0;
        }
      });
    });

    notApplicablePriceValue /= billingFrequency;

    let volumeValue = 0;
    Object.keys(volumeUsageChargePriceList).forEach((key: string) => {
      const maxVolumePrice = volumeUsageChargePriceList[key].length !== 0 ?
        volumeUsageChargePriceList[key].reduce((prev, current) => {
          if (!current.tierEnd) {
            return prev;
          }
          if (prev.tierEnd > current.tierEnd) {
            return prev;
          }
          return current;
        }).tierEnd : 0;

      volumeUsageChargePriceList[key].forEach((childPrice: TmaProductOfferingPrice) => {
        if (Number(childPrice.tierStart) <= extraConsumption) {
          volumeValue += childPrice.price.value ? Number(childPrice.price.value) : 0;
        }
        if (!childPrice.tierStart && !childPrice.tierEnd && maxVolumePrice < extraConsumption) {
          volumeValue += childPrice.price.value ? Number(childPrice.price.value) : 0;
        }
      });
    });

    volumeValue /= billingFrequency;

    const usageChargeValue = eachRespectiveTierValue + highestApplicableTierValue + notApplicablePriceValue + volumeValue;

    averageCost = (oneTimeChargeValue / contractTerm.duration.amount) + (recurringChargeValue / contractTerm.duration.amount) + usageChargeValue;
    return { value: averageCost.toFixed(2).toString(), currencyIso: currency };
  }

  /**
   * Returns the average cost per year based on the consumption and term provided.
   *
   * @param product - The product for which the average cost per year will be returned
   * @param currency - The currency of the price
   * @param consumption - The consumption for which the average cost per year will be computed
   * @param term - The duration of te contract
   * @return A {@link TmaMoney} containing the average cost per year
   */
  getAverageCostPerYear(product: TmaProduct, currency: string, consumption: number, term: number): TmaMoney {
    return {
      value: (Number(this.getAverageCostPerMonth(product, currency, consumption, term).value) * 12).toFixed(2).toString(),
      currencyIso: currency
    };
  }

  /**
   * Returns the sum of the prices provided.
   *
   * @param productOfferingPriceList - List of prices to be added together
   * @return The sum of the prices
   */
  getSumOfPrices(productOfferingPriceList: TmaProductOfferingPrice[]): TmaMoney {
    let sum = 0;
    productOfferingPriceList.forEach((pop: TmaProductOfferingPrice) => sum += Number(pop.price.value));

    return { value: sum.toString(), currencyIso: productOfferingPriceList[0].price.currencyIso };
  }

  /**
   * Returns the highest tier end for the prices provided.
   *
   * @param priceList - List of prices
   * @return The highest tier end
   */
  getMaximumTierEnd(priceList: TmaProductOfferingPrice[]): number {
    const priceWithMaxTierEnd =
      priceList && priceList.length !== 0 ?
        priceList.reduce((prev, current) => {
          if (!current.tierEnd) {
            return prev;
          }
          if (prev.tierEnd > current.tierEnd) {
            return prev;
          }
          return current;
        }) : null;

    if (!priceWithMaxTierEnd || !priceWithMaxTierEnd.tierEnd) {
      return 0;
    }

    return priceWithMaxTierEnd.tierEnd;
  }

  /**
   * Returns the formatted form of the price provided.
   *
   * @param price The price to be formatted
   * @return String containing the formatted price
   */
  getFormattedPrice(price: TmaMoney): string {
    let currencySymbol: string;

    if (!price || !price.currencyIso || !price.value) {
      return '-';
    }

    this.translationService.translate('common.currencies.currency', { context: price.currencyIso })
      .pipe(
        first((currency: string) => currency != null),
        takeUntil(this.destroyed$))
      .subscribe((currency: string) => currencySymbol = currency);

    return currencySymbol + ' ' + price.value;
  }

  /**
   * Returns the formatted form of the contract term provided.
   *
   * @param contractTerm The term to be formatted
   * @return String containing the formatted term
   */
  getFormattedContractTerm(contractTerm: TmaProductOfferingTerm): string {
    if (!contractTerm || !contractTerm.duration || !contractTerm.duration.amount || !contractTerm.duration.units) {
      return '';
    }

    let contractTermUnit = contractTerm.duration.amount > 1 ?
      contractTerm.duration.units.replace(/ly$/, 's') :
      contractTerm.duration.units.replace(/ly$/, '');
    contractTermUnit = contractTermUnit[0].toUpperCase() + contractTermUnit.substr(1).toLowerCase();

    return contractTerm.duration.amount + ' ' + contractTermUnit;
  }

  /**
   * Returns the usage units for the product provided.
   *
   * @param product - The product provided
   * @return The highest tier end
   */
  getUsageUnits(product: TmaProduct): TmaUsageUnit[] {
    const minimumPrice = this.getMinimumPrice(product);
    const priceList = this.getAllPriceList(minimumPrice);
    const usageUnits = priceList
      .filter((price: TmaProductOfferingPrice) => price.chargeType === TmaPopChargeType.USAGE)
      .map((price: TmaProductOfferingPrice) => price.usageUnit);

    return usageUnits.filter((n, i) => usageUnits.indexOf(n) === i);
  }

  protected flattenPriceTree(price: TmaProductOfferingPrice, parent: TmaProductOfferingPrice): void {
    if (price == null) {
      return;
    }

    if (price.bundledPop == null || price.bundledPop.length === 0) {
      this.allPrices.push(price);
      return;
    }

    price.bundledPop.forEach((pop: TmaProductOfferingPrice) => {
      const popCopy = Object.assign({}, parent ? { ...pop, ...parent } : pop);
      const popParent = pop.bundledPop && pop.bundledPop.length !== 0 ? Object.assign({}, pop) : null;
      if (pop.bundledPop) {
        popCopy.bundledPop = pop.bundledPop;
      }
      if (popParent) {
        popParent.bundledPop = null;
      }

      this.flattenPriceTree(popCopy, popParent);
    });
  }

  protected compareInstances(instance1: TmaProductOfferingPrice, instance2: TmaProductOfferingPrice): number {
    const instance1RecurringPriceList = this.getRecurringChargesUnsorted(instance1);
    const instance2RecurringPriceList = this.getRecurringChargesUnsorted(instance2);

    if ((instance1RecurringPriceList && instance1RecurringPriceList.length !== 0) ||
      (instance2RecurringPriceList && instance2RecurringPriceList.length !== 0)) {
      return this.compareCharges(instance1RecurringPriceList, instance2RecurringPriceList);
    }
    return this.compare(this.getOtcPrice(instance1), this.getOtcPrice(instance2));
  }

  protected compareCharges(charges1: TmaProductOfferingPrice[], charges2: TmaProductOfferingPrice[]): number {
    if (!charges1 || charges1.length === 0 || !charges1[0].price || !charges1[0].price.value) {
      return -1;
    }

    if (!charges2 || charges2.length === 0 || !charges2[0].price || !charges2[0].price.value) {
      return 1;
    }

    return this.compare(Number(charges1[0].price.value), Number(charges2[0].price.value));
  }

  protected getRecurringChargesUnsorted(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    return price && price.bundledPop ?
      price.bundledPop.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.RECURRING) : [];
  }

  protected getOtcPrice(price: TmaProductOfferingPrice): number {
    if (price && price.price && price.price.value) {
      return Number(price.price.value);
    }

    const oneTimeCharges: TmaProductOfferingPrice[] = this.getOneTimeCharges(price);
    if (price && oneTimeCharges && oneTimeCharges.length !== 0) {
      return Number(oneTimeCharges[0].price.value);
    }

    return 0;
  }

  protected getBillingFrequency(contractTerm: TmaProductOfferingTerm): number {
    if (!contractTerm || !contractTerm.billingPlan || !contractTerm.billingPlan.billingTime) {
      return 1;
    }

    const billingFrequency: TmaBillingFrequencyMap = this.billingFrequencyConfig.billingFrequency
      .find((frequency: TmaBillingFrequencyMap) => frequency.key === contractTerm.billingPlan.billingTime);

    if (billingFrequency) {
      return billingFrequency.value;
    }

    return 1;
  }

  protected getConsumptionIncludedInPlan(price: TmaProductOfferingPrice, product: TmaProduct) {
    const unitOfMeasure: string = this.getUnitOfMeasure(price);
    const pscvWithMatchingUnitOfMeasure: TmaProductSpecificationCharacteristicValue = product && product.productSpecCharValues ?
      product.productSpecCharValues.find((pscv: TmaProductSpecificationCharacteristicValue) => pscv.unitOfMeasure === unitOfMeasure) :
      null;
    return pscvWithMatchingUnitOfMeasure ? Number(pscvWithMatchingUnitOfMeasure.value) : 0;
  }

  protected getUnitOfMeasure(price: TmaProductOfferingPrice): string {
    if (!price || !price.bundledPop || price.bundledPop.length === 0) {
      return '';
    }

    let priceWithUnitOfMeasure = price.bundledPop.find((childPrice: TmaProductOfferingPrice) => childPrice.usageUnit);
    if (!priceWithUnitOfMeasure) {
      priceWithUnitOfMeasure = price.bundledPop
        .find((childPrice: TmaProductOfferingPrice) => childPrice && childPrice.bundledPop ? childPrice.bundledPop
          .find((bundledPop: TmaProductOfferingPrice) => bundledPop.usageUnit) : false);
      priceWithUnitOfMeasure = priceWithUnitOfMeasure ?
        priceWithUnitOfMeasure.bundledPop.find((childPrice: TmaProductOfferingPrice) => childPrice.usageUnit) : null;
    }
    return priceWithUnitOfMeasure ? priceWithUnitOfMeasure.usageUnit.id : '';
  }

  protected compare(n1: number, n2: number): number {
    return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1);
  }

  protected groupBy(list: any[], field: string): any {
    return list.reduce(function (l: any[], f: string) {
      (l[f[field]] = l[f[field]] || []).push(f);
      return l;
    }, {});
  }
}
