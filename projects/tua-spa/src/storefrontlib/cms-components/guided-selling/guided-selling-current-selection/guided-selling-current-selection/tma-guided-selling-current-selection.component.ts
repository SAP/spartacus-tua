import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Input
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  TmaCart,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaProductOfferingPrice,
  TmaSelectionAction,
  TmaTmfCartItem,
  TmaTmfShoppingCart,
  TmaChecklistAction
} from '../../../../../core/model';
import { Observable, Subject, Subscriber } from 'rxjs';
import {
  TmaGuidedSellingCurrentSelectionsService,
  TmaGuidedSellingStepsService
} from '../../../../../core/guided-selling/facade';
import { TmaPriceService } from '../../../../../core/product/facade';
import {
  BaseSiteService,
  OCC_USER_ID_ANONYMOUS,
  ProductService,
  User,
  UserService,
  TranslationService,
  GlobalMessageService,
  Product,
  GlobalMessageType
} from '@spartacus/core';
import {
  first,
  takeUntil,
  filter,
  take,
  distinctUntilChanged,
  map,
  tap
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { TmaGuidedSellingAddedToCartDialogComponent } from '../guided-selling-added-to-cart-dialog/tma-guided-selling-added-to-cart-dialog.component';
import {
  LOCAL_STORAGE,
  TmaConstantResourceModel
} from '../../../../../core/util/constants';
import {
  TmaTmfCartService,
  TmaActiveCartService,
  TmaChecklistActionService,
  JourneyChecklistConfig
} from '../../../../../core';
import { TmaItem } from '../../../cart';
import { NgxSpinnerService } from 'ngx-spinner';

const { CURRENT_SELECTION } = LOCAL_STORAGE.GUIDED_SELLING;

@Component({
  selector: 'cx-guided-selling-current-selection',
  templateUrl: './tma-guided-selling-current-selection.component.html',
  styleUrls: ['./tma-guided-selling-current-selection.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('false', style({ height: '0px', overflow: 'hidden' })),
      state('true', style({ height: '*' })),
      transition('1 => 0', animate('500ms ease-in')),
      transition('0 => 1', animate('500ms ease-out'))
    ])
  ]
})
export class TmaGuidedSellingCurrentSelectionComponent
  implements OnInit, OnDestroy {
  @ViewChild('addToCartButton', { static: false })
  addToCartButton: ElementRef;

  @Input()
  product: Product;

  currentSelections: TmaProduct[];
  currentSelectionTotal: string;
  parentBpo: TmaProduct;

  currentCart$: Observable<TmaCart>;
  priceValue: TmaProductOfferingPrice[];
  discount: number;

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
    protected modalService: ModalService,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected config?: JourneyChecklistConfig,
    protected translationService?: TranslationService,
    protected globalMessageService?: GlobalMessageService,
    private spinner?: NgxSpinnerService
  ) {
    this.currentSelections = this.guidedSellingCurrentSelectionsService.getCurrentSelections();
    this.currentSelectionTotal = CURRENT_SELECTION.DASH;
  }

  ngOnInit(): void {
    this.bpoCode = this.activatedRoute.snapshot.url[1].toString();
    this.guidedSellingCurrentSelectionsService.shouldRemoveCurrentSelections = true;

    this.currentCart$ = this.activeCartService.getActive();

    this.productService
      .get(this.bpoCode)
      .pipe(
        first((product: TmaProduct) => product != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((product: TmaProduct) => (this.parentBpo = product));

    this.userService
      .get()
      .pipe(
        first((user: User) => user != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));

    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => baseSiteId != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));

    this.guidedSellingCurrentSelectionsService.selection$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((_) => {
        this.currentSelections = this.guidedSellingCurrentSelectionsService.getCurrentSelections();
        this.currentSelectionTotal = this.calculateTotal(
          this.currentSelections
        );
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  availableDiscount(discounts: number): void {
    this.discount = discounts;
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
    this.guidedSellingCurrentSelectionsService.changeSelection(
      product,
      TmaSelectionAction.REMOVE
    );
  }

  /**
   * Returns the sum of one time charges as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getPayNowPrice(
    price: TmaProductOfferingPrice[]
  ): TmaProductOfferingPrice[] | string {
    if (!price || price.length === 0) {
      return CURRENT_SELECTION.DASH;
    }
    this.priceValue = this.priceService.getAllPriceList(price[0]);
    const oneTimePrices: TmaProductOfferingPrice[] = this.priceService.getPayNowPrices(
      this.priceValue
    );
    if (!oneTimePrices || oneTimePrices.length === 0) {
      return CURRENT_SELECTION.DASH;
    }

    return oneTimePrices;
  }

  /**
   * Returns the first recurring charge as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getRecurringPrice(
    price: TmaProductOfferingPrice[]
  ): TmaProductOfferingPrice[] | string {
    if (!price || price.length === 0 || !price[0].bundledPop) {
      return CURRENT_SELECTION.DASH;
    }

    this.priceValue = this.priceService.getAllPriceList(price[0]);
    const recurringPrices: TmaProductOfferingPrice[] = this.priceService.getRecurringPrices(
      this.priceValue
    );
    if (
      !recurringPrices ||
      recurringPrices.length === 0 ||
      !recurringPrices[0].price
    ) {
      return CURRENT_SELECTION.DASH;
    }

    return recurringPrices;
  }

  /**
   * Adds a BPO to the cart.
   *
   * @param currentCart - The cart in which the BPO will be added
   */
  addBpoToCart(currentCart: TmaCart): void {
    this.spinner.show();
    const productOfferingIds: string[] = [];
    this.currentSelections.forEach((product: TmaProduct) => {
      productOfferingIds.push(product.code);
    });
    this.tmaChecklistActionService
      .getChecklistActionsFor(
        this.currentBaseSiteId,
        productOfferingIds,
        TmaProcessTypeEnum.ACQUISITION
      )
      .pipe(
        take(2),
        filter((checklistResult: TmaChecklistAction[]) => !!checklistResult),
        distinctUntilChanged(),
        takeUntil(this.destroyed$),
        map((checklistResult: TmaChecklistAction[]) => {
          if (checklistResult.length === 0) {
            this.addBpoCart(currentCart);
          } else {
            const journeyCheckLists: TmaChecklistAction[] = checklistResult.filter(
              (checklist: TmaChecklistAction) =>
                this.config.journeyChecklist.journeyChecklistSteps.includes(
                  checklist.actionType
                )
            );
            if (Object.keys(journeyCheckLists).length === 0) {
              this.addBpoCart(currentCart);
            } else {
              this.addToCartWithChecklist(journeyCheckLists,currentCart);
            }
          }
        })
      )
      .subscribe();
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
      if (
        product &&
        product.productOfferingPrice &&
        product.productOfferingPrice.length !== 0
      ) {
        oneTimePrices = oneTimePrices.concat(
          this.priceService.getOneTimeCharges(product.productOfferingPrice[0])
        );
      }
    });

    if (!oneTimePrices || oneTimePrices.length === 0) {
      return CURRENT_SELECTION.DASH;
    }

    return this.priceService.getFormattedPrice(
      this.priceService.getSumOfPrices(oneTimePrices)
    );
  }

  protected createCartItemList(children: TmaProduct[]): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];

    children.forEach((child: TmaProduct) => {
      if (child.isBundle) {
        this.productService
          .get(child.code)
          .pipe(
            first((product: TmaProduct) => product != null),
            takeUntil(this.destroyed$)
          )
          .subscribe((product: TmaProduct) => {
            if (this.createCartItemList(product.children).length > 0) {
              cartItemList.push({
                productOffering: {
                  id: child.code
                },
                quantity: 1,
                cartItem: this.createCartItemList(product.children)
              });
            }
          });
        return;
      }
      if (this.currentSelections.some(selection => selection.code === child.code)) {
        cartItemList.push({
          productOffering: {
            id: child.code
          },
          quantity: 1
        });
      }
    });

    return cartItemList;
  }

  protected prepareDataForModal(currentCart: TmaCart): void {
    this.activeCartService
      .getActive()
      .pipe(
        first(
          (cart: TmaCart) =>
            cart &&
            cart.entries &&
            cart.entries.length >
            (currentCart && currentCart.entries
              ? currentCart.entries.length
              : 0)
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe((newCart: TmaCart) => {
        const newlyAddedEntries: TmaOrderEntry[] = this.tmaTmfCartService.getNewlyAddedEntries(
          currentCart,
          newCart
        );
        const resolverAddedEntries: TmaOrderEntry[] = this.resolveEntries(newlyAddedEntries, []);
        if (newlyAddedEntries) {
          this.openModal(resolverAddedEntries);
        }
      });
  }

  protected openModal(entries: TmaOrderEntry[]): void {
    this.spinner.hide();
    let modalInstance: any;
    this.modalRef = this.modalService.open(
      TmaGuidedSellingAddedToCartDialogComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      }
    );

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = new Observable(
      (subscriber: Subscriber<TmaOrderEntry>) => subscriber.next(entries[0])
    );
    modalInstance.entries = entries;
    modalInstance.parentBpo = this.parentBpo;
    modalInstance.cart$ = this.activeCartService.getActive();
    modalInstance.loaded$ = this.activeCartService.isStable();
    modalInstance.quantity = 1;
    modalInstance.increment = false;
  }

  protected resolveEntries(items: TmaOrderEntry[], groupedItems: TmaOrderEntry[]): TmaOrderEntry[] {
    for (const item of items) {
      item.entries ?
        this.resolveEntries(item.entries, groupedItems) :
        groupedItems.push(item);
    }
    return groupedItems;
  }

  protected addToCartWithChecklist(
    journeyCheckLists: TmaChecklistAction[],
    currentCart: TmaCart
  ): void {
    if ( !this.currentUser || this.currentUser.uid === OCC_USER_ID_ANONYMOUS ||
      this.currentUser.uid === undefined) {
      this.spinner.hide();
      this.translationService
        .translate('productDetails.loginNeeded')
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
    else {
      this.addBpoCart(currentCart);
    }
  }

  private addBpoCart(currentCart: TmaCart) {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
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
          quantity: 1,
          cartItem: this.createCartItemList(this.parentBpo.children)
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

  get constants(): TmaConstantResourceModel {
    return LOCAL_STORAGE;
  }

  private setProductDetails(modalInstance: any) {
    const productOfferings = new Map();
    this.currentSelections.forEach(currentSelection => {
      productOfferings.set(currentSelection.code, currentSelection.name);
    });
    modalInstance.product = productOfferings;
  }
}
