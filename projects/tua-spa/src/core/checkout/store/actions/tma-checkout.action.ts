import { Action } from '@ngrx/store';
import { TmaAddress } from '../../../model';

export const SET_DELIVERY_ADDRESS_CART =
  '[Checkout] Set Delivery Address to cart';

export class SetDeliveryAddressToCart implements Action {
  readonly type = SET_DELIVERY_ADDRESS_CART;
  constructor(
    public payload: { userId: string; cartId: string; address: TmaAddress }
  ) {}
}

export type TmaCheckoutAction = 
| SetDeliveryAddressToCart;
