import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseSiteService, GlobalMessageService, GlobalMessageType, TranslationService } from '@spartacus/core';
import { AddToCartComponent, CurrentProductService, ModalService } from '@spartacus/storefront';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, last, map, take, takeUntil } from 'rxjs/operators';
import { LOCAL_STORAGE, TmaProductService } from '../../../../core';
import { TmaActiveCartService, TmaCartService } from '../../../../core/cart/facade';
import { TmaChecklistActionService } from '../../../../core/checklistaction/facade';
import { JourneyChecklistConfig } from '../../../../core/journey-checklist-config/config';
import { TmaCart, TmaChecklistAction, TmaChecklistActionType, TmaOrderEntry, TmaProcessTypeEnum, TmaProduct } from '../../../../core/model';
import { JourneyChecklistStepComponent } from '../../journey-checklist/journey-checklist-step/journey-checklist-step.component';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';

const { JOURNEY_CHECKLIST } = LOCAL_STORAGE;

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaAddToCartComponent extends AddToCartComponent implements OnInit, OnDestroy {
  currentCart$: Observable<TmaCart>;
  currentProduct$: Observable<TmaProduct>;

  productCode: string;
  processType?: TmaProcessTypeEnum;

  protected activeBaseSiteId: string;
  protected destroyed$ = new Subject();

  constructor(
    cartService: TmaCartService,
    modalService: ModalService,
    currentProductService: CurrentProductService,
    changeDetectorRef: ChangeDetectorRef,
    activeCartService: TmaActiveCartService,
    checklistActionService: TmaChecklistActionService,
    baseSiteService: BaseSiteService,
    commodityProductService: TmaProductService,
    globalMessageService: GlobalMessageService,
    translationService: TranslationService
  );

  /**
   *
   * @deprecated Since 1.1.0.
   */
  constructor(
    cartService: TmaCartService,
    modalService: ModalService,
    currentProductService: CurrentProductService,
    changeDetectorRef: ChangeDetectorRef,
    activeCartService: TmaActiveCartService
  );

  constructor(
    protected cartService: TmaCartService,
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected activeCartService: TmaActiveCartService,
    protected checklistActionService?: TmaChecklistActionService,
    protected baseSiteService?: BaseSiteService,
    protected productSpecificationProductService?: TmaProductService,
    protected globalMessageService?: GlobalMessageService,
    protected translationService?: TranslationService,
    protected tmaChecklistActionService?: TmaChecklistActionService,
    protected config?: JourneyChecklistConfig
  ) {
    super(cartService, modalService, currentProductService, changeDetectorRef);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.currentCart$ = this.activeCartService.getActive();
    this.currentProduct$ = this.currentProductService.getProduct();

    this.baseSiteService.getActive()
      .pipe(
        first((baseSiteId: string) => !!baseSiteId),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => this.activeBaseSiteId = baseSiteId);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Adds a SPO to the cart.
   * 
   * @param currentCart - The cart in which the SPO will be added
   */
  addSpoToCart(currentCart: TmaCart): void {
    if (!this.productCode || this.quantity <= 0) {
      return;
    }
    this.tmaChecklistActionService
      .getChecklistActionForProductCode(
        this.activeBaseSiteId,
        this.productCode,
        TmaProcessTypeEnum.ACQUISITION
      )
      .pipe(
        takeUntil(this.destroyed$),
        take(2),
        filter((checklistResult: TmaChecklistAction[]) => !!checklistResult),
        distinctUntilChanged(),
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
    const newEntry$: Observable<TmaOrderEntry> = this.activeCartService.getSpoWithHighestEntryNumber(
      this.productCode
    );
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
    return this.checklistActionService.getChecklistActionForProductCode(this.activeBaseSiteId, productCode);
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
      .subscribe((translation: string) => this.globalMessageService.add(translation, GlobalMessageType.MSG_TYPE_ERROR)).unsubscribe();
    return true;
  }

  protected openStepperModal(checklistActions: TmaChecklistAction[]): void {
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
    modalInstance.productCode = this.productCode;
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
    modalInstance.loaded$ = this.cartService.getLoaded();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
  }
}
