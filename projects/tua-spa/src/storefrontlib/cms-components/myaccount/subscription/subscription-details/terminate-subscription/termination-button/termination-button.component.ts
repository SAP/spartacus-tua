import { Component, Input, OnInit } from '@angular/core';
import {
  BaseSiteService,
  Cart,
  CheckoutService,
  GlobalMessageService,
  GlobalMessageType,
  TranslationService,
  User,
  UserAddressService,
  UserService
} from '@spartacus/core';
import { LoaderState } from '@spartacus/core/src/state/utils/loader';
import { ProcessesLoaderState } from '@spartacus/core/src/state/utils/processes-loader';
import { ModalService } from '@spartacus/storefront';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  DeliveryModeConfig,
  TmaCheckoutDeliveryService,
  TmaMultiCartService,
  TmaTmfCartService
} from '../../../../../../../core/';
import {
  TmaActionType,
  TmaAddress,
  TmaCart,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmfProduct
} from '../../../../../../../core/model';
import { TerminationConfirmComponent } from '../termination-confirm/termination-confirm.component';

@Component({
  selector: 'cx-termination-button',
  templateUrl: './termination-button.component.html',
  styleUrls: ['./termination-button.component.scss']
})
export class TerminationButtonComponent implements OnInit {
  @Input()
  product: TmfProduct;
  modalRef: any;

  userAddresses: TmaAddress[];
  user: User;

  cart: TmaCart;
  baseSiteId: string;
  defaultAddress: TmaAddress;
  state: LoaderState<void>;
  protected destroyed$ = new Subject();

  constructor(
    protected modalService: ModalService,
    protected userAddressService: UserAddressService,
    protected globalMessageService: GlobalMessageService,
    protected translationService: TranslationService,
    protected userService: UserService,
    protected multiCartService: TmaMultiCartService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected baseSiteService: BaseSiteService,
    protected translation: TranslationService,
    protected checkoutDeliveryService: TmaCheckoutDeliveryService,
    protected checkoutService: CheckoutService,
    protected config: DeliveryModeConfig
  ) {}

  ngOnInit(): void {
    this.userAddressService.loadAddresses();
    this.userAddressService
      .getAddresses()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((addresses: TmaAddress[]) => (this.userAddresses = addresses));
  }

  /**
   * Open the Termination process popup on click of terminate button on subscription details page.
   * During the termination process flow,following activites are performed:-
   * 1.)Creates an empty cart.
   * 2.)Add to cart with remove action entry of subscribed product.
   * 3.)Sets the default address.
   * 4.)Sets the default delivery mode.
   * If user does not have any default address , it will show global error message.
   */
  openTerminatePopup() {
    this.defaultAddress = this.userAddresses.find(
      (address: TmaAddress) => address.defaultAddress
    );
    if (this.defaultAddress) {
      this.userService
        .get()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((customer: User) => (this.user = customer));
      this.baseSiteService
        .getActive()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
      this.multiCartService
        .createCart({
          userId: this.user.uid
        })
        .pipe(
          filter((cartState: ProcessesLoaderState<Cart>) => !cartState.loading),
          takeUntil(this.destroyed$)
        )
        .subscribe((cartState: ProcessesLoaderState<Cart>) => {
          if (cartState.value) {
            this.cart = cartState.value;
            this.addToCart();
          }
        });
    } else {
      this.translationService
        .translate('subscriptions.deliveryAddressRequired')
        .pipe(
          tap((translatedMessage: string) =>
            this.globalMessageService.add(
              translatedMessage,
              GlobalMessageType.MSG_TYPE_ERROR
            )
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe();
    }
  }

  protected addToCart(): void {
    const cartEntry: TmaOrderEntry = {
      action: TmaActionType.REMOVE,
      processType: {
        id: TmaProcessTypeEnum.TERMINATION
      },
      subscribedProduct: {
        id: this.product.id
      }
    };
    this.multiCartService.addCartEntry(
      this.user.uid,
      this.cart.code,
      cartEntry
    );
    this.modalService.closeActiveModal('close payment modal');
    const oldCart = this.cart;
    this.multiCartService
      .getCart(oldCart.code)
      .pipe(
        take(2),
        filter(
          (currentCart: TmaCart) =>
            currentCart &&
            currentCart.entries &&
            currentCart.entries.length >
              (oldCart && oldCart.entries ? oldCart.entries.length : 0)
        ),
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      )
      .subscribe((currentCart: TmaCart) => {
        this.cart = currentCart;
        const newlyAddedEntries: TmaOrderEntry[] = this.tmaTmfCartService.getNewlyAddedEntries(
          oldCart,
          currentCart
        );
        if (newlyAddedEntries) {
          this.setDefaultDeliveryAddress();
        }
      });
  }

  /**
   * Sets the default delivery address with cart.
   * Once the delivery address association with cart is successfull then default delivery mode is set.
   * If there is no address associated with an user then required delivery address message is present to an user.
   */
  protected setDefaultDeliveryAddress(): void {
    this.checkoutDeliveryService.setDeliveryAddressTo(
      this.user.uid,
      this.cart.code,
      this.defaultAddress
    );
    this.checkoutDeliveryService
      .getSetDeliveryAddressProcess()
      .pipe(
        take(2),
        filter((state: LoaderState<void>) => !state.loading),
        distinctUntilChanged(),
        takeUntil(this.destroyed$),
        map((state: LoaderState<void>) => {
          if (state.success) {
            this.setDefaultDeliveryMode();
          } else if (state.error) {
            this.checkoutDeliveryService.clearCheckoutDeliveryDetails();
            this.multiCartService.deleteCart(this.cart.code, this.user.uid);
            this.modalService.closeActiveModal('close active modal');
            this.translation
              .translate('subscriptions.deliveryAddressRequired')
              .pipe(
                tap((translatedMessage: string) =>
                  this.globalMessageService.add(
                    translatedMessage,
                    GlobalMessageType.MSG_TYPE_ERROR
                  )
                ),
                takeUntil(this.destroyed$)
              )
              .subscribe();
          }
        })
      )
      .subscribe();
  }

  /**
   * Sets the default delivery mode with cart.
   * Once the delivery mode association with cart is successfull then termination confirm pop up opens.
   */
  protected setDefaultDeliveryMode(): void {
    this.checkoutDeliveryService.setDeliveryModeTo(
      this.user.uid,
      this.cart.code,
      this.config.deliveryMode.default_delivery_mode
    );
    this.checkoutDeliveryService
      .getSetDeliveryModeProcess()
      .pipe(
        take(3),
        filter((state: LoaderState<void>) => !state.loading),
        distinctUntilChanged(),
        takeUntil(this.destroyed$),
        map((loaderState: LoaderState<void>) => {
          this.state = loaderState;
          if (loaderState.error) {
            this.checkoutDeliveryService.clearCheckoutDeliveryDetails();
            this.multiCartService.deleteCart(this.cart.code, this.user.uid);
            this.modalService.closeActiveModal(
              'close confirm termination popup'
            );
            this.translation
              .translate('subscriptions.deliveryModeNotEligible')
              .pipe(
                tap((translatedMessage: string) =>
                  this.globalMessageService.add(
                    translatedMessage,
                    GlobalMessageType.MSG_TYPE_ERROR
                  )
                ),
                takeUntil(this.destroyed$)
              )
              .subscribe();
          } else if (loaderState.success) {
            let modalInstance: any;
            this.modalRef = this.modalService.open(
              TerminationConfirmComponent,
              {
                centered: true,
                size: 'lg',
                backdrop: 'static',
                keyboard: false
              }
            );

            modalInstance = this.modalRef.componentInstance;
            modalInstance.cart = this.cart;
            modalInstance.subscribedProducts = [this.product];
            modalInstance.state = this.state;
          }
        })
      )
      .subscribe();
  }
}
