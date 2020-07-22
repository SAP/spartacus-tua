import { Injectable } from '@angular/core';
import { TmaItem } from '../../../storefrontlib/cms-components/cart/cart-shared';
import {
  TmaBillingTimeEnum,
  TmaChargeTypeEnum,
  TmaCartItemPrice,
  TmaCartPrice,
  TmaOrderEntry,
  TmaPriceTypeEnum,
  TmaCartTotalPrice,
  TmaOrder,
  TmaCart
} from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaCartPriceService {

  protected cartItemPrice = {} as TmaCartItemPrice;
  protected cartTotalPrice = {} as TmaCartTotalPrice;

  private billingTime = TmaBillingTimeEnum;
  private chargeType = TmaChargeTypeEnum;
  private priceType = TmaPriceTypeEnum;
  private payOnCheckoutPrice: number;
  private discountedPayOnCheckoutPrice: number;

  /**
   * Returns an object that contains the prices (pay on checkout, recurring, usage charges, one time charges which are not pay now) of a cart entry.
   * @param item - the cart entry
   */
  computeEntryPrice(item: TmaItem): TmaCartItemPrice {
    this.cartItemPrice.recurringPrices = [];
    this.cartItemPrice.usageChargePrices = [];
    this.cartItemPrice.oneTimeChargePrices = [];
    this.payOnCheckoutPrice = 0;
    this.discountedPayOnCheckoutPrice = 0;

    this.computeEntryPriceTypes(item.cartPrice.cartPrice);

    this.cartItemPrice.recurringPrices.sort((a, b) => (Number(a.cycle.cycleStart) > Number(b.cycle.cycleStart)) ? 1 : -1);
    this.cartItemPrice.oneTimeChargePrices.sort((a, b) => (a.recurringChargePeriod < b.recurringChargePeriod) ? 1 : -1);
    this.cartItemPrice.usageChargePrices.sort((x, y) => (x.unitOfMeasure > y.unitOfMeasure ? 1 : (x.unitOfMeasure === y.unitOfMeasure ? ((Number(x.tierStart) > Number(y.tierStart) || x.tierStart === undefined) ? 1 : -1) : -1)));
    this.cartItemPrice.payOnCheckoutPrice = this.payOnCheckoutPrice * item.quantity + this.discountedPayOnCheckoutPrice;

    return this.cartItemPrice;
  }

  /**
   * Returns the cart/order subtotal price.
   * @param cart - the cart or order object
   */
  computeSubTotalCartPrice(cart: TmaCart | TmaOrder): number {
    let payOnCheckoutSubTotal = 0;

    if (!cart.entries) {
      return payOnCheckoutSubTotal;
    }

    cart.entries.forEach((entry: TmaOrderEntry) => {
      const entryPayOnCheckoutPrice = this.computeCartEntryPrice(entry.cartPrice.cartPrice, entry.quantity);

      payOnCheckoutSubTotal += entryPayOnCheckoutPrice;
    });

    return payOnCheckoutSubTotal;
  }

  /**
   * Returns an object that contains the cart/order price (subtotal, total, delivery cost).
   * @param cart - the cart or order object
   */
  computeCartPrice(cart: TmaCart | TmaOrder): TmaCartTotalPrice {
    this.cartTotalPrice.payOnCheckoutSubTotal = this.computeSubTotalCartPrice(cart);

    this.computeTotalCartPrice(cart);
    this.cartTotalPrice.payOnCheckoutTotal = Number(this.cartTotalPrice.payOnCheckoutTotal.toFixed(2));

    return this.cartTotalPrice;
  }

  protected computeEntryPriceTypes(cartPrices: TmaCartPrice[]): void {
    cartPrices.forEach((price: TmaCartPrice) => {
      if (Array.isArray(price.cartPrice)) {
        this.computeEntryPriceTypes(price.cartPrice);
      } else {
        if (this.isOneTimePrice(price.chargeType)) {
          this.computeOneTimePrice(price)
        }
        if (this.isRecurringPrice(price.chargeType)) {
          this.cartItemPrice.recurringPrices.push(price);
        }
        if (this.isUsagePrice(price.chargeType)) {
          this.cartItemPrice.usageChargePrices.push(price);
        }
      }
    });
  }

  protected isOneTimePrice(chargeType: string): boolean {
    return chargeType === this.chargeType.OneTime
  }

  protected isRecurringPrice(chargeType: string): boolean {
    return chargeType === this.chargeType.Recurring
  }

  protected isUsagePrice(chargeType: string): boolean {
    return chargeType === this.chargeType.Usage
  }

  protected computeOneTimePrice(price: TmaCartPrice): void {
    if (price.recurringChargePeriod === this.billingTime.PayNow) {
      if (price.priceType === this.priceType.discount) {
        this.discountedPayOnCheckoutPrice += Number(price.taxIncludedAmount.value);
        return
      }
      this.payOnCheckoutPrice += Number(price.taxIncludedAmount.value);
      return
    }
    this.cartItemPrice.oneTimeChargePrices.push(price);
  }

  protected computeTotalCartPrice(cart: TmaCart | TmaOrder): void {
    this.cartTotalPrice.payOnCheckoutTotal = this.cartTotalPrice.payOnCheckoutSubTotal;
    let prices;

    if ('cartCosts' in cart) {
      prices = cart.cartCosts;
    }
    else if ('orderCosts' in cart) {
      prices = cart.orderCosts;
    }
    if (prices) {
      prices.forEach((cartCost: TmaCartPrice) => cartCost.cartPrice.forEach(
        (price: TmaCartPrice) => {
          if (price.recurringChargePeriod === this.billingTime.PayNow) {
            this.cartTotalPrice.payOnCheckoutTotal += Number(price.taxIncludedAmount.value);

            if (price.priceType === this.priceType.deliveryCost) {
              this.cartTotalPrice.deliveryCost = price.taxIncludedAmount.value;
            }
          }
        }
      ));
    }
  }

  protected computeCartEntryPrice(cartPrice: TmaCartPrice[], quantity: number): number {
    let entryTotalPrice = 0;
    let discountedEntryTotalPrice = 0;

    cartPrice.forEach(
      (price: TmaCartPrice) => {
        if (price.recurringChargePeriod === this.billingTime.PayNow) {
          if (price.priceType === this.priceType.discount) {
            discountedEntryTotalPrice += Number(price.taxIncludedAmount.value);
          } else {
            entryTotalPrice += Number(price.taxIncludedAmount.value);
          }
        }
      });

    entryTotalPrice = entryTotalPrice * quantity + discountedEntryTotalPrice;
    return entryTotalPrice;
  }
}
