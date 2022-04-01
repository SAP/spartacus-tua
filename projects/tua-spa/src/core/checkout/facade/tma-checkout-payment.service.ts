import { Injectable } from '@angular/core';	
import { CheckoutActions, CheckoutPaymentService } from '@spartacus/checkout/core';
import {	
  PaymentDetails	
} from '@spartacus/core';	

@Injectable({	
  providedIn: 'root'	
})	
export class TmaCheckoutPaymentService extends CheckoutPaymentService {	
  /**	
   * Sets the given payment id on the cart of the user.	
   *	
   * @param cartId a cart ID	
   * @param paymentId a payment method ID	
   */	
  setPaymentDetailsFor(cartId: string, paymentId: string): void {	
    const paymentDetails = {	
      id: paymentId	
    };	
    if (this.actionAllowed()) {	
      let userId;	
      this.userIdService	
        .getUserId()	
        .subscribe((occUserId: string) => (userId = occUserId))	
        .unsubscribe();	

      if (userId && cartId) {	
        this.checkoutStore.dispatch(	
          new CheckoutActions.SetPaymentDetails({	
            userId,	
            cartId: cartId,	
            paymentDetails: paymentDetails	
          })	
        );	
      }	
    }	
  }	

  /**	
   * Create payment details and assign it to cart of the user.	
   *	
   * @param paymentId a payment method ID	
   * @param cartId a cart ID	
   */	
  createPaymentDetailsFor(	
    paymentDetails: PaymentDetails,	
    cartId: string	
  ): void {	
    if (this.actionAllowed()) {	
      let userId;	
      this.userIdService	
        .getUserId()	
        .subscribe((occUserId) => (userId = occUserId))	
        .unsubscribe();	

      if (userId && cartId) {	
        this.checkoutStore.dispatch(	
          new CheckoutActions.CreatePaymentDetails({	
            userId,	
            cartId,	
            paymentDetails	
          })	
        );	
      }	
    }	
  }	
}
