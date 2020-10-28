import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  TmaCart,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaProductOfferingPrice,
  TmaSelectionAction,
  TmaTmfActionType,
  TmaTmfCartItem,
  TmaTmfShoppingCart
} from '../../../../../core/model';
import { Observable, Subject, Subscriber } from 'rxjs';
import {
  TmaGuidedSellingCurrentSelectionsService,
  TmaGuidedSellingStepsService
} from '../../../../../core/guided-selling/facade';
import { TmaPriceService } from '../../../../../core/product/facade';
import { BaseSiteService, OCC_USER_ID_ANONYMOUS, ProductService, User, UserService } from '@spartacus/core';
import { first, takeUntil } from 'rxjs/operators';
import { TmaTmfCartService } from '../../../../../core/tmf-cart/facade';
import { ActivatedRoute } from '@angular/router';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { TmaGuidedSellingAddedToCartDialogComponent } from '../guided-selling-added-to-cart-dialog/tma-guided-selling-added-to-cart-dialog.component';
import { LOCAL_STORAGE, TmaConstantResourceModel } from '../../../../../core/util/constants';
import { TmaActiveCartService } from '../../../../../core/cart/facade';

const { CURRENT_SELECTION } = LOCAL_STORAGE.GUIDED_SELLING;

@Component({
  selector: 'cx-guided-selling-current-selection',
  templateUrl: './tma-guided-selling-current-selection.component.html',
  styleUrls: ['./tma-guided-selling-current-selection.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('false', style({ height: '0px', 'overflow': 'hidden' })),
      state('true', style({ height: '*' })),
      transition('1 => 0', animate('500ms ease-in')),
      transition('0 => 1', animate('500ms ease-out'))
    ])
  ]
})

export class TmaGuidedSellingCurrentSelectionComponent implements OnInit, OnDestroy {

  @ViewChild('addToCartButton', { static: false })
  addToCartButton: ElementRef;

  currentSelections: TmaProduct[];
  currentSelectionTotal: string;
  parentBpo: TmaProduct;

  currentCart$: Observable<TmaCart>;

  protected isCurrentSelectionExpended: boolean;
  protected bpoCode: string;
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected modalRef: ModalRef;

  protected destroyed$ = new Subject();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected userService: UserService,
    protected baseSiteService: BaseSiteService,
    protected activeCartService: TmaActiveCartService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected priceService: TmaPriceService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected productService: ProductService,
    protected modalService: ModalService
  ) {
    this.currentSelections = this.guidedSellingCurrentSelectionsService.getCurrentSelections();
    this.currentSelectionTotal = CURRENT_SELECTION.DASH;
  }

  ngOnInit(): void {
    this.bpoCode = this.activatedRoute.snapshot.url[1].toString();
    this.guidedSellingCurrentSelectionsService.shouldRemoveCurrentSelections = true;

    this.currentCart$ = this.activeCartService.getActive();

    this.productService.get(this.bpoCode)
      .pipe(
        first((product: TmaProduct) => product != null),
        takeUntil(this.destroyed$))
      .subscribe((product: TmaProduct) => this.parentBpo = product);

    this.userService.get()
      .pipe(
        first((user: User) => user != null),
        takeUntil(this.destroyed$))
      .subscribe((user: User) => this.currentUser = user);

    this.baseSiteService.getActive()
      .pipe(
        first((baseSiteId: string) => baseSiteId != null),
        takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => this.currentBaseSiteId = baseSiteId);

    this.guidedSellingCurrentSelectionsService.selection$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(_ => {
        this.currentSelections = this.guidedSellingCurrentSelectionsService.getCurrentSelections();
        this.currentSelectionTotal = this.calculateTotal(this.currentSelections);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Expands the current selections.
   */
  expandCurrentSelection(): void {
    this.isCurrentSelectionExpended = true;
  }

  /**
   * Collapses current selections.
   */
  collapseCurrentSelection(): void {
    this.isCurrentSelectionExpended = false;
  }

  /**
   * Returns if current selection is collapsed.
   *
   * @return True if current selection is collapsed, otherwise false
   */
  isCurrentSelectionCollapsed(): boolean {
    return !this.isCurrentSelectionExpended;
  }

  /**
   * Removes the provided product from the current selection.
   *
   * @param product - The product which will be removed
   */
  removeProductFromCurrentSelection(product: TmaProduct): void {
    this.guidedSellingCurrentSelectionsService.changeSelection(product, TmaSelectionAction.REMOVE);
  }

  /**
   * Returns the sum of one time charges as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getPayNowPrice(price: TmaProductOfferingPrice[]): string {
    if (!price || price.length === 0) {
      return CURRENT_SELECTION.DASH;
    }

    const oneTimePrices: TmaProductOfferingPrice[] = this.priceService.getOneTimeCharges(price[0]);
    if (!oneTimePrices || oneTimePrices.length === 0) {
      return CURRENT_SELECTION.DASH;
    }

    return this.priceService.getFormattedPrice(this.priceService.getSumOfPrices(oneTimePrices));
  }

  /**
   * Returns the first recurring charge as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getRecurringPrice(price: TmaProductOfferingPrice[]): string {
    if (!price || price.length === 0 || !price[0].bundledPop) {
      return CURRENT_SELECTION.DASH;
    }

    const recurringPrices: TmaProductOfferingPrice[] = this.priceService.getRecurringPrices(price[0].bundledPop);
    if (!recurringPrices || recurringPrices.length === 0 || !recurringPrices[0].price) {
      return CURRENT_SELECTION.DASH;
    }

    return this.priceService.getFormattedPrice(recurringPrices[0].price);
  }

  /**
   * Adds a BPO to the cart.
   *
   * @param currentCart - The cart in which the BPO will be added
   */
  addBpoToCart(currentCart: TmaCart): void {
    const currentUserId: string = this.currentUser && this.currentUser.uid ? this.currentUser.uid : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      id: currentCart.code,
      guid: currentUserId === OCC_USER_ID_ANONYMOUS ? currentCart.guid : null,
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          processType: {
            id: TmaProcessTypeEnum.ACQUISITION
          },
          productOffering: {
            id: this.bpoCode
          },
          cartItem: this.createCartItemList()
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };

    this.tmaTmfCartService.updateCart(shoppingCart);

    this.addToCartButton.nativeElement.disabled = true;
    this.prepareDataForModal(currentCart);
    this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
  }

  /**
   * Removes everything from current selection and resets state.
   */
  clearCurrentSelection(): void {
    this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
    this.guidedSellingStepsService.setFirstStepAsActiveStep();
  }

  protected calculateTotal(currentSelections: TmaProduct[]): string {
    let oneTimePrices: TmaProductOfferingPrice[] = [];
    currentSelections.forEach((product: TmaProduct) => {
      if (product && product.productOfferingPrice && product.productOfferingPrice.length !== 0) {
        oneTimePrices = oneTimePrices.concat(this.priceService.getOneTimeCharges(product.productOfferingPrice[0]));
      }
    });

    if (!oneTimePrices || oneTimePrices.length === 0) {
      return CURRENT_SELECTION.DASH;
    }

    return this.priceService.getFormattedPrice(this.priceService.getSumOfPrices(oneTimePrices));
  }

  protected createCartItemList(): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    this.currentSelections.forEach((product: TmaProduct) =>
      cartItemList.push(
        {
          action: TmaTmfActionType.ADD,
          productOffering: {
            id: product.code
          },
          quantity: 1
        }
      )
    );

    return cartItemList;
  }

  protected getNewlyAddedEntries(oldCart: TmaCart, newCart: TmaCart): TmaOrderEntry[] {
    const entriesWithLastAdded: number[] = [];
    const entriesWithoutLastAdded: number[] = [];
    newCart.entries.forEach((entry: TmaOrderEntry) => entriesWithLastAdded.push(entry.entryNumber));

    if (oldCart.entries) {
      oldCart.entries.forEach((entry: TmaOrderEntry) => entriesWithoutLastAdded.push(entry.entryNumber));
    }

    const newlyAddedEntryIds: number[] = entriesWithLastAdded.filter((entryNumber: number) => entriesWithoutLastAdded.indexOf(entryNumber) < 0);

    const newlyAddedEntries: TmaOrderEntry[] = [];
    newlyAddedEntryIds.forEach((entryNumber: number) => newlyAddedEntries.push(newCart.entries.find((entry: TmaOrderEntry) => entry.entryNumber === entryNumber)));

    return newlyAddedEntries;
  }

  protected prepareDataForModal(currentCart: TmaCart): void {
    this.activeCartService.getActive()
      .pipe(
        first((cart: TmaCart) => cart && cart.entries && cart.entries.length > (currentCart && currentCart.entries ?
          currentCart.entries.length : 0)),
        takeUntil(this.destroyed$))
      .subscribe((newCart: TmaCart) => {
        const newlyAddedEntries: TmaOrderEntry[] = this.getNewlyAddedEntries(currentCart, newCart);

        if (newlyAddedEntries) {
          this.openModal(newlyAddedEntries);
        }
      });
  }

  protected openModal(entries: TmaOrderEntry[]): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaGuidedSellingAddedToCartDialogComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = new Observable((subscriber: Subscriber<TmaOrderEntry>) => subscriber.next(entries[0]));
    modalInstance.entries = entries;
    modalInstance.parentBpo = this.parentBpo;
    modalInstance.cart$ = this.activeCartService.getActive();
    modalInstance.loaded$ = this.activeCartService.getLoaded();
    modalInstance.quantity = 1;
    modalInstance.increment = false;
  }

  get constants(): TmaConstantResourceModel {
    return LOCAL_STORAGE;
  }
}
