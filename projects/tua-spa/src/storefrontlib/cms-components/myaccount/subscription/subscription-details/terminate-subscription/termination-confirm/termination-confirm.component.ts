import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  GlobalMessageService,
  PaymentDetails,
  TranslationService,
  User,
  UserPaymentService,
  UserService
} from '@spartacus/core';
import { LoaderState } from '@spartacus/core/src/state/utils/loader';
import { ModalService } from '@spartacus/storefront';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  take,
  takeUntil
} from 'rxjs/operators';
import {
  DeliveryModeConfig,
  TmaCart,
  TmaCheckoutDeliveryService,
  TmaCheckoutPaymentService,
  TmaCheckoutService,
  TmaMultiCartService,
  TmaOrder,
  TmaOrderEntry,
  TmfProduct
} from '../../../../../../../core/';

@Component({
  selector: 'cx-termination-confirm',
  templateUrl: './termination-confirm.component.html',
  styleUrls: ['./termination-confirm.component.scss']
})
export class TerminationConfirmComponent implements OnInit {
  cart: TmaCart;
  subscribedProducts: TmfProduct[];
  user: User;
  state: LoaderState<void>;
  modalRef: any;
  paymentId: string;
  protected destroyed$ = new Subject();

  constructor(
    protected modalService: ModalService,
    protected userService: UserService,
    protected multiCartService: TmaMultiCartService,
    protected checkoutService: TmaCheckoutService,
    protected config: DeliveryModeConfig,
    protected checkoutDeliveryService: TmaCheckoutDeliveryService,
    protected globalMessageService: GlobalMessageService,
    protected translation: TranslationService,
    protected router: Router,
    protected checkoutPaymentService: TmaCheckoutPaymentService,
    private userPaymentService: UserPaymentService,
    protected spinner?: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.userService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((customer: User) => (this.user = customer));
    this.multiCartService
      .getCart(this.cart.code)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((currentCart: TmaCart) => (this.cart = currentCart));
  }

  closeModal() {
    this.checkoutDeliveryService.resetSetDeliveryAddressProcess();
    this.checkoutDeliveryService.resetSetDeliveryModeProcess();
    this.multiCartService.deleteCart(this.cart.code, this.user.uid);
    this.modalService.closeActiveModal('close termination confirm component');
  }

  /**
   * Retrieves the subscribed product from the order entry.
   *
   * @param entry The order entry of {@ link TmaOrderEntry}
   * @return The product as {@link TmfProduct}
   */
  getEntryProduct(entry: TmaOrderEntry): TmfProduct {
    return this.subscribedProducts.find(
      (subscribedProduct: TmfProduct) =>
        entry.subscribedProduct.id === subscribedProduct.id
    );
  }

  /**
   * Creates the dummy payment details used for one click order for termination flow.
   *
   */
  createPaymentDetails() {
    this.spinner.show();
    const paymentDetails: PaymentDetails = {
      accountHolderName: 'notapplicable',
      billingAddress: {
        country: {
          isocode: 'US',
          name: 'UnitedStates'
        },
        firstName: 'N/A',
        lastName: 'N/A',
        line1: 'N/A',
        postalCode: '08088',
        region: {
          countryIso: 'US',
          isocode: 'US-AL',
          name: 'Alabama',
          isocodeShort: 'AL'
        },
        shippingAddress: false,
        titleCode: 'dr',
        town: 'N/A'
      },
      cardNumber: '4111111111111111',
      cardType: {
        code: 'visa'
      },
      expiryMonth: '02',
      expiryYear: '2050',
      saved: false,
      defaultPayment: false,
      cvn: '221'
    };
    this.checkoutPaymentService.createPaymentDetailsFor(
      paymentDetails,
      this.cart.code
    );
    this.placeOrder();
  }

  /**
   * Places an order and once an order is placed successfully
   * then it redirects to order details page.
   *
   */
  placeOrder(): void {
    this.checkoutPaymentService
      .getPaymentDetails()
      .pipe(
        take(2),
        filter((payment: PaymentDetails) => !!payment),
        distinctUntilChanged(),
        takeUntil(this.destroyed$),
        map((payment: PaymentDetails) => {
          if (payment.accountHolderName) {
            this.paymentId = payment.id;
            this.checkoutService.placeOrderFor(this.cart.code, this.user.uid);
          }
        })
      )
      .subscribe();

    this.checkoutService
      .getOrderDetails()
      .pipe(
        take(2),
        filter((orderPlaced: TmaOrder) => !!orderPlaced),
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      )
      .subscribe((orderPlaced: TmaOrder) => {
        if (orderPlaced.code) {
          this.spinner.hide();
          this.modalService.closeActiveModal('close confirm termination popup');
          this.userPaymentService.deletePaymentMethod(this.paymentId);
          this.checkoutDeliveryService.resetSetDeliveryAddressProcess();
          this.checkoutDeliveryService.resetSetDeliveryModeProcess();
          this.checkoutService.clearCheckoutData();
          this.router.navigate([`/my-account/order/${orderPlaced.code}`]);
        }
      });
  }
}
