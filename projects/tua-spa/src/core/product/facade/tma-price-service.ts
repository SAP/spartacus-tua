import { TmaMoney, TmaProduct, TmaProductOfferingPrice, TmaProductOfferingTerm } from '../../model';
import { Injectable } from '@angular/core';
import { TranslationService } from '@spartacus/core';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TmaPriceService {

  protected allPrices = [];

  constructor(
    protected translationService: TranslationService,
  ) {
  }

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

  getAllPriceList(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    this.allPrices = [];
    this.flattenPriceTree(price, null);
    return this.allPrices;
  }

  getCancellationFeePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === 'oncancellation') : [];
  }


  getPayNowPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === 'paynow') : [];
  }

  getOnFirstBillPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === 'onfirstbill') : [];
  }

  getRecurringPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === 'recurring')
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

  getEachRespectiveTierUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
      .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === 'usage')
      .filter((unitPrice: TmaProductOfferingPrice) => unitPrice.usageType === 'each_respective_tier')
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
      }), 'id') :
      [];
  }

  getHighestApplicableTierUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
      .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === 'usage')
      .filter((unitPrice: TmaProductOfferingPrice) => unitPrice.usageType === 'highest_applicable_tier')
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
      }), 'id') :
      [];
  }

  getNotApplicableUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
      .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === 'usage' && bundledPop.itemType === 'PerUnitUsageCharge')
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
      }), 'id') :
      [];
  }

  getVolumeUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
      .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === 'usage' && bundledPop.itemType === 'VolumeUsageCharge')
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
      }), 'id') :
      [];
  }

  getContractTerm(price: TmaProductOfferingPrice): TmaProductOfferingTerm {
    if (!price || !price.productOfferingTerm || price.productOfferingTerm.length === 0) {
      return null;
    }

    return price.productOfferingTerm[0];
  }

  getSumOfPrices(productOfferingPriceList: TmaProductOfferingPrice[]): TmaMoney {
    let sum = 0;
    productOfferingPriceList.forEach((pop: TmaProductOfferingPrice) => sum += Number(pop.price.value));
    return { value: sum.toString(), currencyIso: productOfferingPriceList[0].price.currencyIso };
  }

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

  getFormattedPrice(price: TmaMoney): string {
    let currencySymbol: string;

    if (!price || !price.currencyIso || !price.value) {
      return '-';
    }

    this.translationService.translate('productDetails.currency.' + price.currencyIso)
      .pipe(first((currency: string) => currency != null))
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
      price.bundledPop.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === 'recurring') : [];
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

  protected getOneTimeCharges(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    return price && price.bundledPop && price.bundledPop.length !== 0 ?
      price.bundledPop.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === 'oneTime') : [];
  }

  protected compare(n1: number, n2: number): number {
    return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1);
  }

  protected groupBy(list: any[], field: string): any {
    return list.reduce(function (l, f) {
      (l[f[field]] = l[f[field]] || []).push(f);
      return l;
    }, {});
  }
}
