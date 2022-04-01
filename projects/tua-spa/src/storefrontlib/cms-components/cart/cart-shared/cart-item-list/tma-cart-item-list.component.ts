import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  CartItemComponentOptions,
  CartItemListComponent
} from '@spartacus/storefront';
import {
  ActiveCartService,
  BaseSiteService,
  ConsignmentEntry,
  OCC_USER_ID_ANONYMOUS,
  ProductSearchPage,
  ProductSearchService,
  ProductService,
  PromotionLocation,
  RoutingService,
  SelectiveCartService,
  User,
  TranslationService,
  GlobalMessageService,
  GlobalMessageType, UserIdService, MultiCartService
} from '@spartacus/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  LogicalResourceType,
  TmaCart,
  TmaProduct,
  TmaSelectionAction,
  TmaTmfShoppingCart,
  TmaValidationMessage,
  TmaValidationMessageType,
  TmaCharacteristic,
  TmaProcessTypeEnum,
  TmaOrderEntry,
  TmaMessage,
  TmaActionType
} from '../../../../../core';
import { first, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { TmaItem } from '../cart-item/tma-cart-item.component';
import {
  LogicalResourceReservationService,
  AppointmentService,
  TmaProductService,
  TmaTmfCartService,
  TmaGuidedSellingCurrentSelectionsService,
  TmaGuidedSellingStepsService,
  LOCAL_STORAGE
} from '../../../../../core';
import { UserAccountFacade } from '@spartacus/user/account/root';

const { QUERY, FREE_TEXT, CODE } = LOCAL_STORAGE.SEARCH;

interface TmaGroupedItemMap {
  [key: number]: TmaItem;
}

@Component({
  selector: 'cx-cart-item-list',
  templateUrl: './tma-cart-item-list.component.html',
  styleUrls: ['./tma-cart-item-list.component.scss']
})
export class TmaCartItemListComponent
  extends CartItemListComponent
  implements OnInit, OnDestroy {
  @Input()
  shouldReloadCart: boolean;

  @Input()
  showEdit?: boolean;

  @Input() readonly = false;

  @Input() hasHeader = true;

  @Input()
  isPremiseDetailsReadOnly: boolean;

  @Input() options: CartItemComponentOptions = {
    isSaveForLater: false,
    optionalBtn: null
  };

  @Input() promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;

  @Input('items')
  set items(items: TmaItem[]) {
    this.resolveTmaItems(items);
    this.createTmaForm();
  }

  get items(): TmaItem[] {
    return this._tmaItems;
  }

  @Input('cartIsLoading') set setLoading(value: boolean) {
    if (!this.readonly) {
      value
        ? this.form.disable({ emitEvent: false })
        : this.form.enable({ emitEvent: false });
    }
  }

  form: FormGroup;
  groupedItems: TmaGroupedItemMap[];
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected currentCart: TmaCart;
  protected destroyed$ = new Subject();
  private _tmaItems: TmaItem[] = [];

  constructor(
    protected activeCartService: ActiveCartService,
    protected fb: FormBuilder,
    protected selectiveCartService: SelectiveCartService,
    protected productService: ProductService,
    protected productSearchService: ProductSearchService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected baseSiteService: BaseSiteService,
    protected userAccountFacade: UserAccountFacade,
    protected multiCartService: MultiCartService,
    protected tmfCartService: TmaTmfCartService,
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected routingService: RoutingService,
    protected userIdService: UserIdService,
    protected translationService?: TranslationService,
    protected globalMessageService?: GlobalMessageService,
    protected appointmentService?: AppointmentService,
    protected logicalResourceReservationService?: LogicalResourceReservationService,
    protected tmaProductService?: TmaProductService
  ) {
    super(activeCartService, selectiveCartService, userIdService, multiCartService);
    this.activeCartService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((cart: TmaCart) => (this.currentCart = cart));
    this.activeCartService
      .getEntries()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((entries: TmaItem[]) => {
        this.items = this.resolveItemList(entries, []);
        this.groupedItems = this.tmfCartService.getGroupedItems(entries);
      });
  }

  ngOnInit(): void {
    this.loadReservationsForCartEntries();

    this.userAccountFacade
      .get()
      .pipe(
        first((user: User) => !!user),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));

    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => !!baseSiteId),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));

    this.groupedItems = this.tmfCartService.getGroupedItems(this.items);
    this.items = this.resolveItemList(this.items, []);

    if (!this.shouldReloadCart) {
      return;
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.logicalResourceReservationService.clearReservationState();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns the product for the provided code.
   *
   * @param code - The identifier of the product
   */
  getProduct(code: string): Observable<TmaProduct> {
    return this.productService.get(code);
  }

  /**
   * Removes a bundled product offering from cart.
   *
   * @param entryGroupNumber - The entry group number of the bundled product offering
   */
  removeBpo(entryGroupNumber: number): void {
    this.guidedSellingStepsService.setFirstStepAsActiveStep();

    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      id: this.currentCart.code,
      guid:
        currentUserId === OCC_USER_ID_ANONYMOUS ? this.currentCart.guid : null,
      baseSiteId: this.currentBaseSiteId,
      relatedParty: [
        {
          id: currentUserId
        }
      ],
      cartItem: [
        {
          id: entryGroupNumber.toString(),
          quantity: 0
        }
      ]
    };

    this.tmfCartService.updateCart(shoppingCart);
  }

  /**
   * Returns compatibility errors for the provided entry group number.
   *
   * @param entryGroupNumber - The entry group number
   * @return List of {@link TmaValidationMessage}
   */
  getCompatibilityErrorsForEntryGroup(
    entryGroupNumber: number
  ): TmaValidationMessage[] {
    let entry: TmaOrderEntry;
    if (this.currentCart && this.currentCart.entries) {
      this.currentCart.entries.forEach((tmaEntry: TmaOrderEntry) => {
        if (tmaEntry.entryNumber === Number(entryGroupNumber)) {
          entry = tmaEntry;
        }
      })
    }
    return this.getCompatibilityErrorsForEntry(entry);
  }

  /**
   * Returns compatibility errors for cart.
   *
   * @return List of {@link TmaMessage}
   */
  getCompatibilityErrorsForCart(): TmaMessage[] {
    if (this.currentCart.message) {
      return this.currentCart.message.filter((message: TmaMessage) =>
        message &&
        message.type === TmaValidationMessageType.COMPATIBILITY)
    }
    return [];
  }

  /**
   * Prepares CGS page with necessary information for edit and redirects to CGS page when information is loaded.
   *
   * @param entryGroupNumber - The group number of the entries
   * @param items - The items part of the entry group
   * @param index - The index of the item currently being processed
   */
  prepareCgsForEdit(
    entryGroupNumber: number,
    items: TmaItem[],
    index: number
  ): void {

    if (index === 0) {
      this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
    }

    if (!items || items.length <= index) {
      this.removeBpo(entryGroupNumber);
      this.redirectToCgsPage(items[0].rootBpoCode, items);

      this.cancelAppointment(items);
      return;
    }

    if (items[index].entries) {
      this.prepareCgsForEdit(entryGroupNumber, items, index + 1);
      return;
    }

    this.productSearchService.search(
      QUERY + FREE_TEXT + CODE + items[index].product.code,
      { pageSize: 1 }
    );
    this.productSearchService
      .getResults()
      .pipe(
        first((productSearchPage: ProductSearchPage) => {
          return (
            productSearchPage &&
            productSearchPage.products &&
            productSearchPage.products.length !== 0 &&
            !!productSearchPage.products.find(
              (product: TmaProduct) =>
                product.code === items[index].product.code
            )
          );
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((productSearchPage: ProductSearchPage) => {
        if (!items[index].subscribedProduct?.characteristic) {
          this.guidedSellingCurrentSelectionsService.changeSelection(
            productSearchPage.products.find(
              (product: TmaProduct) =>
                product.code === items[index].product.code
            ),
            TmaSelectionAction.ADD
          );
        }
        this.prepareCgsForEdit(entryGroupNumber, items, index + 1);
      });
  }

  getControl(item: TmaItem): Observable<FormGroup> {
    return this.form.get(item.entryNumber.toString()).valueChanges.pipe(
      // tslint:disable-next-line:deprecation
      startWith(null),
      map((value: any) => {
        if (value && this.selectiveCartService && this.options.isSaveForLater) {
          this.selectiveCartService.updateEntry(
            value.entryNumber,
            value.quantity
          );
        }
        else if (value) {
          this.activeCartService.updateEntry(value.entryNumber, value.quantity);
        }
      }),
      map(() => <FormGroup>this.form.get(item.entryNumber.toString()))
    );
  }

  /**
   * Checks if the given cart entries have renewal process type.
   *
   * @param items - The cart items
   *
   * @return true if cart item has process type as renewal as a {@link boolean}
   */
  isCartEntryForRenewal(items: TmaItem[]): boolean {
    const renewItem = items.find(
      (item: TmaItem) =>
        item.processType !== undefined &&
        item.processType.id === TmaProcessTypeEnum.RENEWAL
    );
    return renewItem !== undefined;
  }

  getOrderEntryArray(item: TmaOrderEntry): TmaOrderEntry[] {
    return Array.of(item);
  }

  protected resolveItemList(items: TmaItem[], resolvedItems: TmaItem[]): TmaItem[] {

    items.forEach((item: TmaItem) => {
      resolvedItems.push(item);
      if (item.entries) {
        this.resolveItemList(item.entries, resolvedItems);
      }
    });

    return resolvedItems;
  }

  protected cancelAppointment(items: TmaItem[]): void {
    const appointmentItem: TmaItem = items.find(
      (item: TmaItem) => item.appointment !== undefined
    );
    if (appointmentItem) {
      this.appointmentService.cancelAppointment(appointmentItem.appointment.id);
      this.translationService
        .translate('guidedSelling.edit.previousAppointmentDeleted')
        .pipe(
          tap((translatedMessage: string) =>
            this.globalMessageService.add(
              translatedMessage,
              GlobalMessageType.MSG_TYPE_ERROR
            )
          )
        )
        .subscribe()
        .unsubscribe();
    }
  }

  protected hasRootGroups(cart: TmaCart): boolean {
    return cart && cart.rootGroups && cart.rootGroups.length !== 0;
  }

  protected redirectToCgsPage(bpoCode: string, items: TmaItem[]): void {
    items.find((item: TmaItem) => item.action && item.action.toString() === TmaActionType.KEEP) ?
    this.routingService.go({ cxRoute: 'cgs', params: { code: bpoCode, process: TmaProcessTypeEnum.RETENTION } }) :
    this.routingService.go({ cxRoute: 'cgs', params: { code: bpoCode, process: '' } });
  }

  /**
   * This method loads the reservation if any MSISDN is associated with cart entry
   *
   **/
  protected loadReservationsForCartEntries(): void {
    let isMsisdnAssociated = false;
    const cartEntryMsisdns = [];
    if (!this.items) {
      return;
    }
    this.items.forEach((item: TmaItem) => {
      if (!!item.subscribedProduct && !!item.subscribedProduct.characteristic) {
        item.subscribedProduct.characteristic.forEach(
          (logicalResource: TmaCharacteristic) => {
            if (
              logicalResource.value !== null &&
              logicalResource.name === LogicalResourceType.MSISDN
            ) {
              isMsisdnAssociated = true;
              cartEntryMsisdns.push(logicalResource.value);
              return;
            }
          }
        );
      }
    });
    if (isMsisdnAssociated) {
      this.logicalResourceReservationService.loadReservationByUserIdAndResource(
        cartEntryMsisdns
      );
    }
  }

  protected getCompatibilityErrorsForEntry(entry: TmaOrderEntry): TmaValidationMessage[] {
    const validationMessage: TmaValidationMessage[] = [];
    if (entry && entry.entries) {
      entry.entries.forEach((tmaEntry: TmaOrderEntry) => {
        validationMessage.push(...this.getCompatibilityErrorsForEntry(tmaEntry));
      });
    }
    if (entry && entry.validationMessages) {
      let validationMessages: TmaValidationMessage[] = [];
      validationMessages = entry.validationMessages.filter((message: TmaValidationMessage) =>
        message &&
        message.code === TmaValidationMessageType.COMPATIBILITY
      )
      validationMessage.push(...validationMessages)
    }
    return validationMessage;
  }

  /**
   * @param items The items we're getting form the input do not have a consistent model.
   * In case of a `consignmentEntry`, we need to normalize the data from the orderEntry.
   */
  private resolveTmaItems(items: TmaItem[]): void {
    if (items.every((item: TmaItem) => item.hasOwnProperty('orderEntry'))) {
      this._tmaItems = items.map((consignmentEntry: TmaItem) => {
        const entry = Object.assign(
          {},
          (consignmentEntry as ConsignmentEntry).orderEntry
        );
        entry.quantity = consignmentEntry.quantity;
        return entry;
      });
    }
    else {
      this._tmaItems = items;
    }
  }

  private createTmaForm(): void {
    this.form = new FormGroup({});
    this.resolveItemList(this._tmaItems, []).forEach((item: TmaItem) => {
      const entryNumber = item.entryNumber.toString();
      const group = new FormGroup({
        entryNumber: new FormControl((<any>item).entryNumber),
        quantity: new FormControl(item.quantity, { updateOn: 'blur' })
      });
      if (!item.updateable || this.readonly) {
        group.disable();
      }
      this.form.addControl(entryNumber, group);
    });
  }
}
