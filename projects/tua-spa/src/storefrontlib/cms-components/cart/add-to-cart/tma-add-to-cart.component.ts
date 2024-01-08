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
  TmaProcessTypeEnum,
} from '../../../../core/model';
import {
  filter,
  last,
  take,
  takeUntil,
  distinctUntilChanged,
  map,
  first,
  tap,
} from 'rxjs/operators';
import {
  BaseSiteService,
  UserService,
  TranslationService,
  GlobalMessageService,
  User,
  GlobalMessageType,
} from '@spartacus/core';
import { JourneyChecklistStepComponent } from '../../journey-checklist';
import { TmaChecklistActionService } from '../../../../core/checklistaction/facade';
import { JourneyChecklistConfig } from '../../../../core/journey-checklist-config/config';

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

  protected destroyed$ = new Subject();
  protected currentUser: User;
  constructor(
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected cartService: TmaCartService,
    protected activeCartService: TmaActiveCartService,
    protected baseSiteService?: BaseSiteService,
    protected tmaChecklistActionService?: TmaChecklistActionService,
    protected config?: JourneyChecklistConfig,
    protected userService?: UserService,
    protected translationService?: TranslationService,
    protected globalMessageService?: GlobalMessageService
  ) {
    super(modalService, currentProductService, changeDetectorRef, cartService);
    this.currentCart$ = this.activeCartService.getActive();
    this.baseSiteService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
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
              this.addToCartWithChecklist(journeyCheckLists);
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
    const productOfferingCodes: string[] = [this.productCode];
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
    modalInstance.productOfferingCodes = productOfferingCodes;
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
    modalInstance.loaded$ = this.cartService.isStable();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
  }

  protected addToCartWithChecklist(
    journeyCheckLists: TmaChecklistAction[]
  ): void {
    if (this.currentUser && this.currentUser.uid) {
      this.openStepperModal(journeyCheckLists);
    } else {
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
