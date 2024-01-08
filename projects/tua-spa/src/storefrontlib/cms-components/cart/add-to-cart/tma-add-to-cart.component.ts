import { AddToCartComponent, CurrentProductService, ModalService } from '@spartacus/storefront';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TmaActiveCartService, TmaCartService } from '../../../../core/cart/facade';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { Observable, Subject } from 'rxjs';
import {
  TmaCart,
  TmaChecklistAction,
  TmaChecklistActionType,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaProduct
} from '../../../../core/model';
import { distinctUntilChanged, filter, first, last, map, take, takeUntil, tap } from 'rxjs/operators';
import { BaseSiteService, GlobalMessageService, GlobalMessageType, TranslationService, User, UserService } from '@spartacus/core';
import { JourneyChecklistStepComponent } from '../../journey-checklist';
import { TmaChecklistActionService } from '../../../../core/checklistaction/facade';
import { JourneyChecklistConfig, TmaProductService } from '../../../../core';

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaAddToCartComponent extends AddToCartComponent implements OnInit, OnDestroy {

  currentProduct$: Observable<TmaProduct>;
  currentCart$: Observable<TmaCart>;

  productCode: string;
  processType?: TmaProcessTypeEnum;

  protected baseSiteId: string;
  protected destroyed$ = new Subject();
  protected currentUser: User;

  constructor(
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected cartService: TmaCartService,
    protected activeCartService: TmaActiveCartService,
    protected productSpecificationProductService?: TmaProductService,
    protected globalMessageService?: GlobalMessageService,
    protected translationService?: TranslationService,
    protected baseSiteService?: BaseSiteService,
    protected tmaChecklistActionService?: TmaChecklistActionService,
    protected config?: JourneyChecklistConfig,
    protected userService?: UserService
  ) {
    super(modalService, currentProductService, changeDetectorRef, cartService);

    this.currentProduct$ = this.currentProductService.getProduct();
    this.currentCart$ = this.activeCartService.getActive();
    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => !!baseSiteId),
        takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));

    this.userService
      .get()
      .pipe(
        first((user: User) => user != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Adds a SPO to the cart.
   */
  addSpoToCart(): void {
    if (!this.productCode || this.quantity <= 0) {
      return;
    }
    this.tmaChecklistActionService
      .getChecklistActionForProductCode(
        this.baseSiteId,
        this.productCode,
        TmaProcessTypeEnum.ACQUISITION
      )
      .pipe(
        take(2),
        filter((checklistResult: TmaChecklistAction[]) => !!checklistResult),
        distinctUntilChanged(),
        takeUntil(this.destroyed$),
        map((checklistResult: TmaChecklistAction[]) => {
          if (Object.keys(checklistResult).length !== 0) {
            const journeyCheckLists: TmaChecklistAction[] = checklistResult.filter(
              (checklist: TmaChecklistAction) =>
                this.config.journeyChecklist.journeyChecklistSteps.includes(
                  checklist.actionType
                )
            );
            if (Object.keys(journeyCheckLists).length !== 0) {
              this.openStepperModal(journeyCheckLists);
            }
            else {
              this.addCartEntry();
            }
          }
          else {
            this.addCartEntry();
          }
        })
      )
      .subscribe();
  }

  addCartEntry(): void {
    this.cartService.addEntry(this.productCode, this.quantity);
    const newEntry$: Observable<TmaOrderEntry> = this.activeCartService.getSpoWithHighestEntryNumber(this.productCode);
    newEntry$
      .pipe(
        take(2),
        filter((newEntry: TmaOrderEntry) => !!newEntry),
        last(),
        takeUntil(this.destroyed$)
      )
      .subscribe((newEntry: TmaOrderEntry) => {
        this.increment = newEntry.quantity > 1;
        this.openAddToCartModal(newEntry$);
      });
  }

  /**
   * Returns the checklist actions for the provided product code
   *
   * @param productCode - product code
   * @return List of {@link TmaChecklistAction} as an {@link Observable}
   */
  getChecklistActions(productCode: string): Observable<TmaChecklistAction[]> {
    return this.tmaChecklistActionService.getChecklistActionForProductCode(this.baseSiteId, productCode);
  }

  /**
   * Checks if the Add To Cart button should be displayed
   *
   * @param checklistActions - list of checklist actions
   * @param productSpecificationId - product specification id
   */
  shouldDisplayAddToCartButton(checklistActions: TmaChecklistAction[], productSpecificationId: string): boolean {
    if (!this.productSpecificationProductService.isProductSpecificationForViewDetails(productSpecificationId)) {
      return !this.productSpecificationProductService.isProductSpecificationForViewDetails(productSpecificationId);
    }

    if (checklistActions.find((checklistAction: TmaChecklistAction) => checklistAction.actionType === TmaChecklistActionType.INSTALLATION_ADDRESS)) {
      return false;
    }

    this.translationService.translate('premiseDetails.checkAvailabilityErrorMessage')
      .pipe(
        first((translation: string) => !!translation))
      .subscribe((translation: string) => this.globalMessageService.add(translation, GlobalMessageType.MSG_TYPE_ERROR))
      .unsubscribe();
    return true;
  }

  protected openStepperModal(checklistActions: TmaChecklistAction[]): void {
    const productOfferingCodes: string[] = [this.productCode];
    let modalInstance: any;
    this.modalRef = this.modalService.open(JourneyChecklistStepComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.checklistActions = checklistActions;
    modalInstance.quantity = this.quantity;
    modalInstance.productOfferingCodes = productOfferingCodes;
  }

  protected openAddToCartModal(entry$: Observable<TmaOrderEntry>): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
      centered: true,
      size: 'lg'
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = entry$;
    modalInstance.cart$ = this.cartService.getActive();
    modalInstance.loaded$ = this.cartService.isStable();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
  }

  protected addToCartWithChecklist(
    journeyCheckLists: TmaChecklistAction[]
  ): void {
    if (this.currentUser && this.currentUser.uid) {
      this.openStepperModal(journeyCheckLists);
    }
    else {
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
  }
}
