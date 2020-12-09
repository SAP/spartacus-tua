import {
  TmaMoney,
  TmaPopBillingEventType,
  TmaPopChargeType,
  TmaProduct,
  TmaProductOfferingPrice,
  TmaProductOfferingTerm
} from '../../model';
import { Injectable, OnDestroy } from '@angular/core';
import { TranslationService } from '@spartacus/core';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LOCAL_STORAGE } from '../../util';

const {
  RANGE
} = LOCAL_STORAGE.DECIMAL;

@Injectable({
  providedIn: 'root'
})
export class TmaPriceService implements OnDestroy {

  protected readonly ID: string = 'id';

  protected allPrices = [];

  public priceValue: TmaProductOfferingPrice[];

  protected destroyed$ = new Subject();

  constructor(
    protected translationService: TranslationService
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns the highest priority price of a SPO product.
   *
   * @param product - The product for which the highest priority price will be returned
   *
   * @return A {@link TmaProductOfferingPrice} that has highest priority
   */
  getHighestPriorityPriceForSPO(product: TmaProduct): TmaProductOfferingPrice {
    const highestPrioritySPOPrice = product.productOfferingPrice.filter(
      (bundledPop: TmaProductOfferingPrice) =>
        bundledPop.isPriceOverride === false
    );
    if (highestPrioritySPOPrice.length === 1) {
      return highestPrioritySPOPrice[0];
    }
    let highestPriorityPrice = highestPrioritySPOPrice[0];
    if (highestPrioritySPOPrice.length > 0) {
      highestPrioritySPOPrice.forEach((pop: TmaProductOfferingPrice) => {
        if (pop.priority >= highestPriorityPrice.priority) {
          highestPriorityPrice = pop;
        }
      });
    }
    return highestPriorityPrice;
  }

  /**
   * Flattens the prices of a product and returns them in a list.
   *
   * @param price - The price which will be flattened
   * @return List of {@link TmaProductOfferingPrice}
   */
  getAllPriceList(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    this.allPrices = [];
    this.flattenPriceTreeWithDiscount(price, null,[]);
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
   * Calculate sum of the prices provided.
   *
   * @param productOfferingPriceList - List of prices to be added together
   * @return The sum of the prices
   */
  getSumOfPrices(productOfferingPriceList: TmaProductOfferingPrice[]): TmaMoney {
    let sum = 0;
    productOfferingPriceList.forEach(
      (pop: TmaProductOfferingPrice) => (sum += Number(pop.price.value))
    );
    return {
      value: sum.toString(),
      currencyIso: productOfferingPriceList[0].price.currencyIso
    };
  }

  /**
   * Returns the formatted form of the price provided.
   *
   * @param price The price to be formatted
   * @return String containing the formatted price
   */
  getFormattedPrice(price: TmaMoney): string {
    let currencySymbol: string = null;

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
   * Returns a list containing usage product offering prices.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} usage charges
   */
  getUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
        .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE)
        .filter((unitPrice: TmaProductOfferingPrice) => unitPrice.id !== null)
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
   * Returns the cumulative sum of prices after alternations
   *
   * @param productOfferingPriceList - List of prices to be calculated
   * @return The actual calculated price (@link TmaMoney)
   */
  calculatePrice(productOfferingPriceList: TmaProductOfferingPrice[]): TmaMoney {
    const sumPrice = this.getSumOfPrices(productOfferingPriceList);
    let discountCharges: TmaProductOfferingPrice[] = [];
    productOfferingPriceList.forEach((bundledPop: TmaProductOfferingPrice) => {
      discountCharges = bundledPop.alterations;
    });
    if (discountCharges && discountCharges.length > 0) {
      return {
        value: this.calculatePriceWithDiscounts(
          Number(sumPrice.value),
          discountCharges
        ).toFixed(RANGE),
        currencyIso: productOfferingPriceList[0].price.currencyIso
      };
    }
    return sumPrice;
  }

   /**
   * Return the total discount applied on a price
   * (OriginalPrice is 10, and has discountedPrice is 8 , so total discount available is 2)
   *
   * @param originalPrice
   *                Original Price of an offering
   * @param discountedPrice
   *                Discounted Price of an offering
   * @return Total applied discount on the original price
   */
  calculateTotalDiscount(originalPrice:Number,discountedPrice:Number):number {
    return (Number(originalPrice) - Number(discountedPrice));
  }


  /**
   * Returns the list of discount charges for product offering prices
   *
   * @param productOfferingPriceList(TmaProductOfferingPrice[])- List of prices of an offering
   * @return (TmaProductOfferingPrice[]) discount charges for a product offering prices
   */
  getDiscounts(productOfferingPriceList: TmaProductOfferingPrice[]):TmaProductOfferingPrice[] {
    let discountCharges:TmaProductOfferingPrice[] =[];
     productOfferingPriceList.forEach((bundledPop: TmaProductOfferingPrice) =>{
      discountCharges = bundledPop.alterations;
    })
    if (discountCharges && discountCharges.length>0 && discountCharges.find((charge:TmaProductOfferingPrice) => charge.cycle ) === undefined)    {
      return discountCharges;
    }
      return [];
  }

  /**
   * Returns the sum of the charges with discounts filter out .
   *
   * @param productOfferingPriceList - List of charges to be added together
   * @return The sum of the charges
   */
  sumOfCharges(productOfferingPriceList: TmaProductOfferingPrice[]): TmaMoney {
    const otherCharges = productOfferingPriceList.filter(
      (bundledPop: TmaProductOfferingPrice) =>
        bundledPop.chargeType !== TmaPopChargeType.DISCOUNT
    );
    return this.getSumOfPrices(otherCharges);
  }

  /**
   * Returns the list of all alternations for a price , if any alternation has cycle attached.
   *
   * @param productOfferingPriceList - Price for which alterations are to be listed
   * @return @return List of {@link TmaProductOfferingPrice} alterations of charges
   */
  getCycledPriceAlterations(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    if (price.alterations.find((alteration: TmaProductOfferingPrice) => alteration.cycle)) {
      return price.alterations.reverse();
    }
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

  protected calculatePriceWithDiscounts(price: Number, discountCharges :TmaProductOfferingPrice[]): Number {
    let discountPrice = price;
    if (discountCharges.find((charge:TmaProductOfferingPrice) => charge.cycle ) === undefined)
    {
      discountCharges.reverse().forEach((discount:TmaProductOfferingPrice)=>{
        discountPrice = this.calculatePriceWithDiscount(discountPrice,discount);
      });
    }
    return discountPrice;
  }

  protected calculatePriceWithDiscount(price:Number,discountCharge:TmaProductOfferingPrice):Number {
    let calculatedPrice:Number;
    if (discountCharge.isPercentage)
    {
      calculatedPrice = Number(price)*(1-(Number(discountCharge.price.value)/100));
    }
    else
    {
      calculatedPrice = Number(price)-Number(discountCharge.price.value);
    }
    return calculatedPrice;
  }

  protected flattenPriceTreeWithDiscount(price: TmaProductOfferingPrice, parent: TmaProductOfferingPrice, priceAlterations:TmaProductOfferingPrice[]): void {
    if (price == null) {
      return;
    }
    if (price.bundledPop == null || price.bundledPop.length === 0) {
      price.alterations = price.alterations.filter(
        (alteration: TmaProductOfferingPrice) =>
          alteration.billingEvent === price.billingEvent
      );
      this.allPrices.push(price);
      return;
    }
    const productOfferingPrices = price.bundledPop.filter(
      (bundledPop: TmaProductOfferingPrice) =>
        bundledPop.chargeType === undefined ||
        bundledPop.chargeType !== TmaPopChargeType.DISCOUNT
    );
    const alterations = price.bundledPop.filter(
      (bundledPop: TmaProductOfferingPrice) =>
        bundledPop.chargeType === TmaPopChargeType.DISCOUNT
    );
    const newAlterations = priceAlterations.concat(alterations);
    productOfferingPrices.forEach((pop: TmaProductOfferingPrice) => {
      const popCopy = Object.assign({}, parent ? { ...pop, ...parent } : pop);
      popCopy.alterations = newAlterations;
      const popParent = pop.bundledPop && pop.bundledPop.length!== 0 ? Object.assign({}, pop) : null;
      if (pop.bundledPop) {
        popCopy.bundledPop = pop.bundledPop;
      }
      if (popParent) {
        popParent.bundledPop = null;
      }
      if (pop.chargeType!== TmaPopChargeType.DISCOUNT)
      {
        this.flattenPriceTreeWithDiscount(popCopy, popParent, popCopy.alterations);
      }
    });
  }
}
