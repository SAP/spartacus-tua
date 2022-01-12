import { Injectable } from '@angular/core';
import { CheckoutDeliveryService, CheckoutActions } from '@spartacus/core';
import { TmaAddress } from '../../model';
import { TmaCheckoutAction } from '../store';
@Injectable({
  providedIn: 'root'
})
export class TmaCheckoutDeliveryService extends CheckoutDeliveryService {
  /**
   * Sets the given delivery mode on the cart of the user.
   * For example if the mode is "Subscription-only", then it will set this delivery mode to the cart.
   *
   * @param userId
   *         The identifier of the user as {@link string}
   * @param cartId
   *         The identifier of the cart as {@link string}
   * @param mode
   *         The identifier of the delivery mode as {@link string}
   */
  setDeliveryModeTo(userId: string, cartId: string, mode: string): void {
    this.checkoutStore.dispatch(
      new CheckoutActions.SetDeliveryMode({
        userId,
        cartId,
        selectedModeId: mode
      })
    );
  }

  /**
   * Sets the given Delivery Address on the cart of the user.
   *
   * @param userId
   *         The identifier of the user as {@link string}
   * @param cartId
   *         The identifier of the cart as {@link string}
   * @param address
   *         The Address as {@link TmaAddress}
   */
  setDeliveryAddressTo(
    userId: string,
    cartId: string,
    address: TmaAddress
  ): void {
    this.checkoutStore.dispatch(
      new TmaCheckoutAction.SetDeliveryAddressToCart({
        userId,
        cartId,
        address: address
      })
    );
  }
}
