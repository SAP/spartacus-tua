import { Injectable } from '@angular/core';	
import { CheckoutActions, CheckoutService } from '@spartacus/checkout/core';

@Injectable({	
  providedIn: 'root'	
})	
export class TmaCheckoutService extends CheckoutService {	
  /**	
   * Place Order for a given cart and user Id.	
   *	
   * @param cartId	
   *        The identifier of thr cart ID as {@link string}	
   * @param userId	
   *        The identifier of thr user ID as {@link string}	
   */	
  placeOrderFor(cartId: string, userId: string): void {	
    this.checkoutStore.dispatch(	
      new CheckoutActions.PlaceOrder({	
        userId,	
        cartId,	
        termsChecked:false	
      })	
    );	
  }	
}
