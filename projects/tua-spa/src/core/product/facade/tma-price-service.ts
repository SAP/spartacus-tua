import {
  TmaItemType,
  TmaMoney,
  TmaPopBillingEventType,
  TmaPopChargeType,
  TmaProduct,
  TmaProductOfferingPrice,
  TmaProductOfferingTerm, TmaUsageType
} from '../../model';
import { Injectable, OnDestroy } from '@angular/core';
import { TranslationService } from '@spartacus/core';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmaPriceService implements OnDestroy {

  protected readonly ID: string = 'id';

  protected allPrices = [];

  protected destroyed$ = new Subject();

  constructor(
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
