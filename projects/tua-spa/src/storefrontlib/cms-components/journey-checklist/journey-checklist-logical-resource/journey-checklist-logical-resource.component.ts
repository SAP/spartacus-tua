import { take, first, filter, takeUntil } from 'rxjs/operators';
import {
  ResourceRef,
  LogicalResourceType,
  Reservation,
  TmaCharacteristic
} from '../../../../core/model';
import { AvailabilityCheckService } from '../../../../core/availability-check';
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
  JourneyChecklistConfig
} from '../../../../core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  UserService,
  BaseSiteService,
  User,
  OCC_USER_ID_ANONYMOUS
} from '@spartacus/core';
import { LogicalResourceReservationService } from '../../../../core/reservation';

const { MSISDN_TYPE } = LOCAL_STORAGE.MSISDN_RESERVATION;

@Component({
  selector: 'cx-journey-checklist-logical-resource',
  templateUrl: './journey-checklist-logical-resource.component.html',
  styleUrls: ['./journey-checklist-logical-resource.component.scss']
})
export class JourneyChecklistLogicalResourceComponent implements OnInit, OnDestroy {
  @Input()
  checkListLength: number;

  @Input()
  cartEntry: TmaOrderEntry;

  @Input()
  isEdit: boolean;

  @Output()
  msisdnSelected = new EventEmitter<any>();

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
  protected currentCart: TmaCart;
  protected currentUser: User;
  protected destroyed$ = new Subject();
  protected currentBaseSiteId: string;

  constructor(
    protected resourceCheckAvailabilityService: AvailabilityCheckService,
    protected availabilityCheckService: AvailabilityCheckService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected activeCartService: TmaActiveCartService,
    protected logicalResourceReservationService: LogicalResourceReservationService,
    protected userService: UserService,
    protected baseSiteService: BaseSiteService,
    protected config: JourneyChecklistConfig,
    private modalService: NgbModal
  ) {
  }

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

  closeModal() {
    this.modalService.dismissAll();
  }

  selectedLogicalResource(resource: ResourceRef): void {
    this.msisdnChanged = this.msisdn === resource.value;
    this.resourceCheckAvailabilityService.setSelectedLogicalResource(resource);
    this.msisdnSelected.emit({ msisdnSelected: true });
    this.currentMsisdn = resource;
  }

  updateCart() {
    let cartEntryMsisdn: string;
    this.cartEntry.subscribedProduct.characteristic.forEach(
      (pscv: TmaCharacteristic) => {
        if (pscv.value !== null && pscv.name === LogicalResourceType.MSISDN) {
          cartEntryMsisdn = pscv.value;
        }
      }
    );
    if (!cartEntryMsisdn) {
      return;
    }
    this.logicalResourceReservationService
      .updateReservationForLogicalResource(this.currentMsisdn, cartEntryMsisdn)
      .pipe(
        take(2),
        filter((updatedReservation: Reservation) => !!updatedReservation),
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
    this.logicalResourceReservationService
      .getUpdateReservationError(cartEntryMsisdn)
      .pipe(
        take(2),
        filter((result: string) => !!result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: string) => {
        this.patchError = result;
        return;
      });
  }

  updateCartEntry(msisdnNumber: string): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          id:
            this.currentCart.code +
            '_' +
            this.cartEntry.entryNumber +
            '_' +
            'SPO',
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

  private updateCartEntryIfNoError(msisdn: string) {
    if (!this.patchError) {
      this.updateCartEntry(msisdn);
      this.closeModal();
    }
  }
}
