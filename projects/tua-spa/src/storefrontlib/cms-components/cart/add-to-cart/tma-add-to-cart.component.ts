import { TmaProcessTypeEnum } from './../../../../core/model';
import {
  AddToCartComponent,
  CurrentProductService,
  ModalService,
} from '@spartacus/storefront';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  TmaActiveCartService,
  TmaCartService,
} from '../../../../core/cart/facade';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { Observable, Subject } from 'rxjs';
import {
  TmaCart,
  TmaOrderEntry,
  TmaChecklistAction,
} from '../../../../core/model';
import {
  filter,
  last,
  take,
  takeUntil,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';
import { BaseSiteService } from '@spartacus/core';
import { JourneyChecklistStepComponent } from '../../journey-checklist/journey-checklist-step/journey-checklist-step.component';
import { TmaChecklistActionService } from '../../../../core/checklistaction/facade';
import { LOCAL_STORAGE } from '../../../../core';
const { JOURNEY_CHECKLIST } = LOCAL_STORAGE;

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaAddToCartComponent
  extends AddToCartComponent
  implements OnInit, OnDestroy {
  currentCart$: Observable<TmaCart>;

  baseSiteId: string;
  productCode: string;
  processType?: TmaProcessTypeEnum;
  checklistAction$: Observable<TmaChecklistAction[]>;

  protected destroyed$ = new Subject();
  constructor(
    protected cartService: TmaCartService,
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected activeCartService: TmaActiveCartService,
    protected baseSiteService?: BaseSiteService,
    protected tmaChecklistActionService?: TmaChecklistActionService
  ) {
    super(cartService, modalService, currentProductService, changeDetectorRef);
    this.currentCart$ = this.activeCartService.getActive();
    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  /**
   * Adds a SPO to the cart.
   * @param currentCart - The cart in which the SPO will be added
   */
  addSpoToCart(currentCart: TmaCart): void {
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
                JOURNEY_CHECKLIST.includes(checklist.actionType)
            );
            if (Object.keys(journeyCheckLists).length !== 0) {
              this.openStepperModal(journeyCheckLists);
            } else {
              this.addCartEntry();
            }
          } else {
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

  protected openStepperModal(checklistActions: TmaChecklistAction[]): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(JourneyChecklistStepComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
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
      size: 'lg',
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = entry$;
    modalInstance.cart$ = this.cartService.getActive();
    modalInstance.loaded$ = this.cartService.getLoaded();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
  }
}
