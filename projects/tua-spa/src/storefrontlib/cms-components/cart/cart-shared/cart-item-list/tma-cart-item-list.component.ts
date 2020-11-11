import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CartItemListComponent } from '@spartacus/storefront';
import {
  BaseSiteService,
  CartService,
  FeatureConfigService,
  OCC_USER_ID_ANONYMOUS,
  ProductSearchPage,
  ProductSearchService,
  ProductService,
  RoutingService,
  SelectiveCartService,
  User,
  UserService
} from '@spartacus/core';
import { FormBuilder } from '@angular/forms';
import { TmaItem } from '..';
import {
  TmaCart,
  TmaProduct,
  TmaRootGroup,
  TmaSelectionAction,
  TmaTmfShoppingCart,
  TmaValidationMessage,
  TmaValidationMessageType,
  LogicalResourceType,
  TmaCharacteristic
} from '../../../../../core/model';
import { first, takeUntil } from 'rxjs/operators';
import { TmaTmfCartService } from '../../../../../core/tmf-cart/facade';
import { Observable, Subject } from 'rxjs';
import {
  TmaGuidedSellingCurrentSelectionsService,
  TmaGuidedSellingStepsService
} from '../../../../../core/guided-selling/facade';
import { LOCAL_STORAGE } from '../../../../../core/util/constants';
import { LogicalResourceReservationService } from '../../../../../core/reservation/facade';

const { QUERY, FREE_TEXT, CODE } = LOCAL_STORAGE.SEARCH;

interface TmaGroupedItemMap {
  [key: number]: TmaItem;
}

@Component({
  selector: 'cx-cart-item-list',
  templateUrl: './tma-cart-item-list.component.html',
  styleUrls: ['./tma-cart-item-list.component.scss']
})
export class TmaCartItemListComponent extends CartItemListComponent implements OnInit, OnDestroy {
  @Input()
  shouldReloadCart: boolean;

  @Input()
  isCartPage?: boolean;

  items: TmaItem[];
  groupedItems: TmaGroupedItemMap[];

  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected currentCart: TmaCart;
  protected destroyed$ = new Subject();

  constructor(
    protected cartService: CartService,
    protected fb: FormBuilder,
    protected selectiveCartService: SelectiveCartService,
    protected featureConfigService: FeatureConfigService,
    protected productService: ProductService,
    protected productSearchService: ProductSearchService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected baseSiteService: BaseSiteService,
    protected userService: UserService,
    protected tmfCartService: TmaTmfCartService,
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected routingService: RoutingService,
    protected logicalResourceReservationService?: LogicalResourceReservationService
  ) {
    super(cartService, fb, selectiveCartService, featureConfigService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadReservationsForCartEntries();

    this.userService
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

    this.groupedItems = this.getGroupedItems(this.items);

    if (!this.shouldReloadCart) {
      return;
    }

    this.cartService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((cart: TmaCart) => (this.currentCart = cart));

    this.cartService
      .getEntries()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((entries: TmaItem[]) => {
        this.items = entries;
        this.groupedItems = this.getGroupedItems(this.items);
      });

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
          id: this.currentCart.code + '_' + entryGroupNumber,
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
    if (!entryGroupNumber || !this.hasRootGroups(this.currentCart)) {
      return null;
    }

    return this.currentCart.rootGroups
      .filter(
        (rootGroup: TmaRootGroup) =>
          Number(rootGroup.groupNumber) === Number(entryGroupNumber)
      )
      .map((rootGroup: TmaRootGroup) => rootGroup.validationMessages)
      .reduce(
        (
          accumulator: TmaValidationMessage[],
          currentValue: TmaValidationMessage[]
        ) => accumulator.concat(currentValue),
        []
      )
      .filter(
        (validationMessage: TmaValidationMessage) =>
          validationMessage &&
          validationMessage.code === TmaValidationMessageType.COMPATIBILITY
      );
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
      this.redirectToCgsPage(items[0].rootBpoCode);
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
        this.guidedSellingCurrentSelectionsService.changeSelection(
          productSearchPage.products.find(
            (product: TmaProduct) => product.code === items[index].product.code
          ),
          TmaSelectionAction.ADD
        );
        this.prepareCgsForEdit(entryGroupNumber, items, index + 1);
      });
  }

  protected getGroupedItems(items: TmaItem[]): TmaGroupedItemMap[] {
    const groups: TmaGroupedItemMap[] = [];

    for (const item of items) {
      const groupNr: number = item.entryGroupNumbers[0]
        ? item.entryGroupNumbers[0]
        : -1;
      if (!groups[groupNr]) {
        groups[groupNr.toString()] = [];
      }

      groups[groupNr.toString()].push(item);
    }

    return groups;
  }

  protected hasRootGroups(cart: TmaCart): boolean {
    return cart && cart.rootGroups && cart.rootGroups.length !== 0;
  }

  protected redirectToCgsPage(bpoCode: string): void {
    this.routingService.go({ cxRoute: 'cgs', params: { code: bpoCode } });
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
            if (logicalResource.value !== null && logicalResource.name === LogicalResourceType.MSISDN) {
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
}
