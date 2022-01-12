import { take, first, filter, takeUntil } from 'rxjs/operators';
import {
  ResourceRef,
  LogicalResourceType,
  Reservation,
  TmaCharacteristic,
  AvailabilityCheckService
} from '../../../../../core';
import { Component, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import {
  LOCAL_STORAGE,
  TmaTmfCartService,
  TmaActiveCartService,
  TmaOrderEntry,
  TmaCart,
  TmaTmfShoppingCart,
  ReservationStateType,
  JourneyChecklistConfig,
  LogicalResourceReservationService,
  MsisdnReservationService
} from '../../../../../core';
import {
  UserService,
  BaseSiteService,
  User,
  OCC_USER_ID_ANONYMOUS
} from '@spartacus/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalService } from '@spartacus/storefront';

const { MSISDN_TYPE } = LOCAL_STORAGE.MSISDN_RESERVATION;

@Component({
  selector: 'cx-journey-checklist-logical-resource-form',
  templateUrl: './journey-checklist-logical-resource-form.component.html',
  styleUrls: ['./journey-checklist-logical-resource-form.component.scss']
})
export class JourneyChecklistLogicalResourceFormComponent
  implements OnInit, OnDestroy {
  @Input()
  checkListLength: number;

  @Input()
  cartEntry: TmaOrderEntry;

  @Input()
  isEdit: boolean;

  @Output()
  errorPost = new EventEmitter<any>();

  selectedAvailableLogicalResource: string;
  currentMsisdn: ResourceRef;
  logicalResources$: Observable<ResourceRef[]>;
  defaultResourceValue: string;
  msisdnChanged: boolean;
  msisdn: string;
  error$: Observable<string>;
  patchError: any;
  errorResult: string;
  protected currentCart: TmaCart;
  protected currentUser: User;
  protected destroyed$ = new Subject();
  protected currentBaseSiteId: string;
  protected logicalResourceValue: Reservation;
  protected cartEntryMsisdn: string;

  constructor(
    protected resourceCheckAvailabilityService: AvailabilityCheckService,
    protected availabilityCheckService: AvailabilityCheckService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected activeCartService: TmaActiveCartService,
    protected logicalResourceReservationService: LogicalResourceReservationService,
    protected userService: UserService,
    protected baseSiteService: BaseSiteService,
    protected config: JourneyChecklistConfig,
    protected msisdnReservationService: MsisdnReservationService,
    protected spinner: NgxSpinnerService,
    protected modalService: ModalService
  ) {}

  ngOnInit() {
    this.error$ = this.availabilityCheckService.getAvailabilityCheckError();
    this.logicalResources$ = this.availabilityCheckService.getResourceCheckAvailability(
      this.config.journeyChecklist.msisdn_reservation
        .msisdn_applied_capacity_amount,
      MSISDN_TYPE
    );
    if (!this.cartEntry) {
      this.logicalResources$
        .pipe(
          take(2),
          filter((result: ResourceRef[]) => !!result),
          takeUntil(this.destroyed$)
        )
        .subscribe((resources: ResourceRef[]) => {
          if (resources.length > 0) {
            this.defaultResourceValue = resources[0].value;
            this.selectedLogicalResource(resources[0]);
            this.selectedAvailableLogicalResource = resources[0].value;
          }
        });
    } else {
      if (
        this.cartEntry.subscribedProduct &&
        this.cartEntry.subscribedProduct.characteristic
      ) {
        this.cartEntry.subscribedProduct.characteristic.forEach(
          (pscv: TmaCharacteristic) => {
            if (pscv.value && pscv.name === LogicalResourceType.MSISDN) {
              this.cartEntryMsisdn = pscv.value;
            }
          }
        );
      }
      this.logicalResourceReservationService
        .getReservationByLogicalResourceValue(this.cartEntryMsisdn)
        .pipe(
          filter((result: Reservation) => !!result),
          take(1),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: Reservation) => {
          this.logicalResourceValue = result;
        });
    }

    this.msisdnChanged = true;
    this.activeCartService
      .getActive()
      .pipe(
        filter((result: TmaCart) => result != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((cart: TmaCart) => (this.currentCart = cart));
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
        first((baseSiteId: string) => baseSiteId != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));
    this.availabilityCheckService
      .getAvailabilityCheckError()
      .pipe(
        take(2),
        filter((result: string) => result != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: string) => {
        this.errorPost.emit(result);
      });
  }

  ngOnDestroy(): void {
    this.availabilityCheckService.clearAvailabilityCheckState();
    this.availabilityCheckService.clearAvailabilityCheckError();
    this.logicalResourceReservationService.clearCreatedReservationState();
    this.logicalResourceReservationService.clearReservationError();
    this.logicalResourceReservationService.clearUpdateReservationError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

/**
 * Close the model.
 */
  closeModal(): void {
    this.modalService.dismissActiveModal(
      'close journey checklist logical component'
    );
  }

/**
 * Clears the selected logical resource from state and close the model.
 */
closeAndClearModal(): void {
    this.availabilityCheckService.clearSelectedLogicalResourceState();
    this.closeModal();
  }

  /**
   * Sets the selected logical resource in state
   *
   * @param  resource {@link ResourceRef}
   *
   */
  selectedLogicalResource(resource: ResourceRef): void {
    this.msisdnChanged = this.msisdn === resource.value;
    this.resourceCheckAvailabilityService.setSelectedLogicalResource(resource);
    this.currentMsisdn = resource;
  }

  /**
   * Update cart entry with MSISDN
   * If cart entry is undefined then close the logical resource form model
   * If cart entry is present with MSISDN then update reservation otherwise create reservation
   *
   */
  updateCart(): void {
    if (this.cartEntry === undefined) {
      this.closeModal();
      return;
    }
    if (this.cartEntryMsisdn && this.logicalResourceValue) {
      this.logicalResourceReservationService.updateReservationFor(
        this.currentMsisdn,
        this.logicalResourceValue.id
      );

      this.logicalResourceReservationService
        .getUpdateReservationError(this.cartEntryMsisdn)
        .pipe(
          take(2),
          filter((result: string) => !!result),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: string) => {
          this.patchError = result;
          return;
        });

      this.logicalResourceReservationService
        .getReservationByLogicalResourceValue(this.currentMsisdn.value)
        .pipe(
          take(2),
          filter((result: Reservation) => !!result),
          takeUntil(this.destroyed$)
        )
        .subscribe((updatedReservation: Reservation) => {
          if (
            updatedReservation.reservationState ===
            (ReservationStateType.REJECTED || ReservationStateType.CANCELLED)
          ) {
            this.patchError = updatedReservation.reservationState;
            return;
          }
          this.updateCartEntryIfNoError(this.currentMsisdn.value);
        });
    } else {
      this.msisdnReservationService.createReservationFor(
        this.cartEntry.product
      );
      this.updateCartWithMsisdnNewReservation();
    }
  }

  protected updateCartEntry(msisdnNumber: string): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          id: this.cartEntry.entryNumber.toString(),
          product: {
            characteristic: [
              {
                name: LogicalResourceType.MSISDN,
                value: msisdnNumber
              }
            ]
          }
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  protected updateCartWithMsisdnNewReservation(): void {
    this.logicalResourceReservationService
      .getCreateReservationError()
      .pipe(
        take(2),
        filter((result: string) => result != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: string) => {
        this.spinner.hide();
        this.errorResult = result;
        return;
      });
    this.logicalResourceReservationService
      .getCreatedReservation()
      .pipe(
        take(2),
        filter((result: Reservation) => Object.keys(result).length !== 0),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: Reservation) => {
        if (
          result.reservationState.toUpperCase() ===
          (ReservationStateType.REJECTED.toUpperCase() ||
            ReservationStateType.CANCELLED.toUpperCase())
        ) {
          this.spinner.hide();
          this.errorResult = result.reservationState;
          return;
        }
        if (
          !!result.reservationItem[0] &&
          !!result.reservationItem[0].appliedCapacityAmount[0].resource[0].value
        ) {
          const msisdnValueSelected =
            result.reservationItem[0].appliedCapacityAmount[0].resource[0]
              .value;
          this.updateCartEntryIfNoError(msisdnValueSelected);
        }
      });
  }

  private updateCartEntryIfNoError(msisdn: string) {
    if (!this.patchError && this.cartEntry) {
      this.updateCartEntry(msisdn);
      this.spinner.hide();
      this.closeModal();
    }
  }
}
