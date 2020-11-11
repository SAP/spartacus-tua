import { Injectable } from '@angular/core';
import {
  TmaChargeType,
  TmaCartItemPrice,
  TmaCartPrice,
  TmaPriceType,
  TmaCartTotalPrice,
  TmaOrder,
  TmaCart,
  TmaOrderEntry,
  TmaBillingTimeType
} from '../../model';
import { TmaItem } from '../../../storefrontlib/cms-components/cart/cart-shared';

@Injectable({
  providedIn: 'root'
})
export class TmaCartPriceService {

  protected cartItemPrice: TmaCartItemPrice = {} as TmaCartItemPrice;
  protected cartTotalPrice: TmaCartTotalPrice = {} as TmaCartTotalPrice;

  private payOnCheckoutPrice: number;
  private discountedPayOnCheckoutPrice: number;

  /**
   * Returns an object that contains the prices (pay on checkout, recurring, usage charges, one time charges which are not pay now) of a cart entry.
   *
   * @param item - the cart entry
   * @return A {@link TmaCartItemPrice} containing the prices for the entry
   */
  computeEntryPrice(item: TmaItem): TmaCartItemPrice {
    const PARENT_ID = 'parentId';
    this.cartItemPrice.recurringPrices = [];
    this.cartItemPrice.usageChargePrices = [];
    this.cartItemPrice.oneTimeChargePrices = [];
    this.payOnCheckoutPrice = 0;
    this.discountedPayOnCheckoutPrice = 0;

    this.computeEntryPriceTypes(item.cartPrice.cartPrice, '');

    this.cartItemPrice.recurringPrices.sort((a, b) => (Number(a.cycle.cycleStart) > Number(b.cycle.cycleStart)) ? 1 : -1);
    this.cartItemPrice.oneTimeChargePrices.sort((a, b) => (a.recurringChargePeriod < b.recurringChargePeriod) ? 1 : -1);
    this.cartItemPrice.usageChargePrices = this.groupBy(this.cartItemPrice.usageChargePrices.sort((x, y) =>
      (x.unitOfMeasure > y.unitOfMeasure ? 1 : (x.unitOfMeasure === y.unitOfMeasure ?
        ((Number(x.tierStart) > Number(y.tierStart) || x.tierStart === undefined) ? 1 : -1) : -1))), PARENT_ID);

    this.cartItemPrice.payOnCheckoutPrice = Number((this.payOnCheckoutPrice * item.quantity + this.discountedPayOnCheckoutPrice).toFixed(2));

    return this.cartItemPrice;
  }

  /**
   * Returns the cart/order subtotal price.
   *
   * @param cart - the cart or order object
   * @return The subtotal price of the cart
   */
  computeSubTotalCartPrice(cart: TmaCart | TmaOrder): number {
    let payOnCheckoutSubTotal = 0;

    if (!cart.entries) {
      return Number(payOnCheckoutSubTotal.toFixed(2));
    }

    cart.entries.forEach((entry: TmaOrderEntry) =>
      payOnCheckoutSubTotal += this.computeCartEntryPrice(entry.cartPrice.cartPrice, entry.quantity)
    );

    return Number(payOnCheckoutSubTotal.toFixed(2));
  }

  /**
   * Returns an object that contains the cart/order price (subtotal, total, delivery cost).
   *
   * @param cart - the cart or order object
   * @return A {@link TmaCartTotalPrice} containing the subtotal and total price of the cart
   */
  computeCartTotalPrice(cart: TmaCart | TmaOrder): TmaCartTotalPrice {
    this.cartTotalPrice.deliveryCost = 0;
    this.cartTotalPrice.payOnCheckoutSubTotal = this.computeSubTotalCartPrice(cart);

    this.computeTotalCartPrice(cart);
    this.cartTotalPrice.payOnCheckoutTotal = Number(this.cartTotalPrice.payOnCheckoutTotal.toFixed(2));

    return this.cartTotalPrice;
  }

  /**
   * Returns the maximum tier ending for the provided prices.
   *
   * @param priceList - the list of usage prices
   * @return The maximum tier ending
   */
  getMaximumTierEnd(priceList: TmaCartPrice[]): number {
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

    return Number(priceWithMaxTierEnd.tierEnd);
  }

  protected computeEntryPriceTypes(cartPrices: TmaCartPrice[], id?: string): void {
    cartPrices.forEach((price: TmaCartPrice) => {
      if (Array.isArray(price.cartPrice)) {
        this.computeEntryPriceTypes(price.cartPrice, price.id);
        return;
      }

      if (this.isOneTimePrice(price.chargeType)) {
        this.computeOneTimePrice(price);
      }
      if (this.isRecurringPrice(price.chargeType)) {
        this.cartItemPrice.recurringPrices.push(price);
      }
      if (this.isUsagePrice(price.chargeType)) {
        const newPrice = Object.assign({}, price);
        newPrice.parentId = id;
        this.cartItemPrice.usageChargePrices.push(newPrice);
      }
    });
  }

  protected isOneTimePrice(chargeType: string): boolean {
    return chargeType === TmaChargeType.ONE_TIME;
  }

  protected isRecurringPrice(chargeType: string): boolean {
    return chargeType === TmaChargeType.RECURRING;
  }

  protected isUsagePrice(chargeType: string): boolean {
    return chargeType === TmaChargeType.USAGE;
  }

  protected computeOneTimePrice(price: TmaCartPrice): void {
    if (price.recurringChargePeriod === TmaBillingTimeType.PAY_NOW) {
      if (price.priceType === TmaPriceType.DISCOUNT) {
        this.discountedPayOnCheckoutPrice += Number(price.taxIncludedAmount.value);
        return;
      }
      this.payOnCheckoutPrice += Number(price.taxIncludedAmount.value);
      return;
    }
    this.cartItemPrice.oneTimeChargePrices.push(price);
  }

  protected computeTotalCartPrice(cart: TmaCart | TmaOrder): void {
    this.cartTotalPrice.payOnCheckoutTotal = this.cartTotalPrice.payOnCheckoutSubTotal;
    const prices = 'cartCosts' in cart ? cart.cartCosts : (<TmaOrder>cart).orderCosts;

    if (!prices) {
      return;
    }

    prices.forEach((cartCost: TmaCartPrice) =>
      this.computeCartPrice(cartCost.cartPrice)
    );
  }

  protected computeCartPrice(priceList: TmaCartPrice[]): void {
    if (!priceList || priceList.length === 0) {
      return;
    }

    priceList.forEach((price: TmaCartPrice) => {
        this.computeCartPrice(price.cartPrice);

        if (price.recurringChargePeriod !== TmaBillingTimeType.PAY_NOW) {
          return;
        }

        this.cartTotalPrice.payOnCheckoutTotal += Number(price.taxIncludedAmount.value);

        if (price.priceType === TmaPriceType.DELIVERY_COST) {
          this.cartTotalPrice.deliveryCost = price.taxIncludedAmount.value;
        }
      }
    );
  }

  protected computeCartEntryPrice(cartPrice: TmaCartPrice[], quantity: number): number {
    let entryTotalPrice = 0;
    let discountedEntryTotalPrice = 0;

    cartPrice.forEach((price: TmaCartPrice) => {
      if (price.recurringChargePeriod === TmaBillingTimeType.PAY_NOW) {
        if (price.priceType === TmaPriceType.DISCOUNT) {
          discountedEntryTotalPrice += Number(price.taxIncludedAmount.value);
        }
        else {
          entryTotalPrice += Number(price.taxIncludedAmount.value);
        }
      }
    });

    entryTotalPrice = entryTotalPrice * quantity + discountedEntryTotalPrice;
    return entryTotalPrice;
  }

  protected groupBy(list: any[], field: string): any {
    return list.reduce(function (l: any[], f: string) {
      (l[f[field]] = l[f[field]] || []).push(f);
      return l;
    }, {});
  }
}
