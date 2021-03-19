import { TmaTmfCartService } from '../../../../core';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CartTotalsComponent } from '@spartacus/storefront';
import { ActiveCartService, BaseSiteService } from '@spartacus/core';
import {
  TmaCart,
  TmaMessage,
  TmaRootGroup,
  TmaValidationMessage,
  TmaValidationMessageType,
  TmaChecklistAction,
  TmaOrderEntry,
  TmaChecklistActionType,
  TmaPlace,
  TmaPlaceRole,
  TmaCharacteristic,
  LogicalResourceType,
  AppointmentService,
  TmaChecklistActionService,
  LogicalResourceReservationService,
  JourneyChecklistConfig
} from '../../../../core';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'cx-cart-totals',
  templateUrl: './tma-cart-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartTotalsComponent extends CartTotalsComponent
  implements OnInit, OnDestroy {
  hasAppointmentError$: Observable<boolean>;
  hasCancelledAppointment$: Observable<boolean>;
  hasReservationError$: Observable<boolean>;
  hasCancelledReservations$: Observable<boolean>;
  hasChecklistFulfilled: Boolean = true;
  baseSiteId: string;
  protected destroyed$ = new Subject();

  constructor(
    protected activeCartService: ActiveCartService,
    protected appointmentService: AppointmentService,
    public checklistActionService?: TmaChecklistActionService,
    public tmfCartService?: TmaTmfCartService,
    protected logicalResourceReservationService?: LogicalResourceReservationService,
    protected baseSiteService?: BaseSiteService,
    protected config?: JourneyChecklistConfig
  ) {
    super(activeCartService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.baseSiteService
      .getActive()
      .pipe(first((baseSiteId: string) => !!baseSiteId))
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));

    this.hasAppointmentError$ = this.appointmentService.hasAppointmentError();
    this.hasCancelledAppointment$ = this.appointmentService.hasCancelledAppointment();
    this.hasReservationError$ = this.logicalResourceReservationService.hasReservationError();
    this.hasCancelledReservations$ = this.logicalResourceReservationService.hasCancelledReservations();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Checks if cart has compatibility errors.
   *
   * @param cart - The cart
   * @return True if cart has compatibility errors, otherwise false
   */
  hasCompatibilityErrors(cart: TmaCart): boolean {
    return (
      this.hasCompatibilityErrorsOnCartLevel(cart) ||
      this.hasCompatibilityErrorsOnEntryLevel(cart)
    );
  }
  /**
   * Checks if checklist are fulfilled then enable the checkout button
   *
   * @param checklistResult list of {@link TmaChecklistAction}
   * @param entry of {@link TmaOrderEntry}
   */
  enableCheckout(
    checklistResult: TmaChecklistAction[],
    entry: TmaOrderEntry
  ): void {
    let checklistActionsFulfilled: Boolean = true;
    let appointmentSelected: Boolean = true;
    let installationAddressSelected: Boolean = true;
    let msisdnSelected: Boolean = true;

    if (Object.keys(checklistResult).length !== 0) {
      const journeyCheckLists: TmaChecklistAction[] = checklistResult.filter(
        (checklist: TmaChecklistAction) =>
          this.config.journeyChecklist.journeyChecklistSteps.includes(
            checklist.actionType
          )
      );
      if (Object.keys(journeyCheckLists).length !== 0) {
        const checklistActionTypes: string[] = journeyCheckLists.map(
          (checklist: TmaChecklistAction) => checklist.actionType
        );

        if (checklistActionTypes && checklistActionTypes.length > 0) {
          if (
            checklistActionTypes.includes(TmaChecklistActionType.APPOINTMENT)
          ) {
            appointmentSelected = this.hasAppointment(entry);
          }
          if (
            checklistActionTypes.includes(
              TmaChecklistActionType.INSTALLATION_ADDRESS
            )
          ) {
            installationAddressSelected = this.hasInstallationAddress(entry);
          }
          if (checklistActionTypes.includes(TmaChecklistActionType.MSISDN)) {
            msisdnSelected = this.hasMsisdn(entry);
          }
        }
        checklistActionsFulfilled =
          appointmentSelected && installationAddressSelected && msisdnSelected;
        this.hasChecklistFulfilled = checklistActionsFulfilled;
      }
    }
  }

  /**
   * Resets the checklist Fulfilled if there cart entry is updated
   */
  resetChecklist(): void {
    this.hasChecklistFulfilled = true;
  }

  protected hasCompatibilityErrorsOnCartLevel(cart: TmaCart): boolean {
    return (
      cart.message &&
      !!cart.message.find(
        (validationMessage: TmaMessage) =>
          validationMessage.type === TmaValidationMessageType.COMPATIBILITY
      )
    );
  }

  protected hasCompatibilityErrorsOnEntryLevel(cart: TmaCart): boolean {
    return (
      cart.rootGroups &&
      !!cart.rootGroups.find((rootGroup: TmaRootGroup) => {
        if (
          rootGroup.validationMessages &&
          !!rootGroup.validationMessages.find(
            (validationMessage: TmaValidationMessage) =>
              validationMessage.code === TmaValidationMessageType.COMPATIBILITY
          )
        ) {
          return rootGroup;
        }
      })
    );
  }

  protected hasInstallationAddress(entry: TmaOrderEntry): boolean {
    return !!(entry &&
      entry.subscribedProduct &&
      entry.subscribedProduct.place &&
      entry.subscribedProduct.place.find(
        (place: TmaPlace) => place.role === TmaPlaceRole.INSTALLATION_ADDRESS
      ));
  }

  protected hasMsisdn(entry: TmaOrderEntry): boolean {
    return !!(entry &&
      entry.subscribedProduct &&
      entry.subscribedProduct.characteristic &&
      entry.subscribedProduct.characteristic.find(
        (tmaCharacteristic: TmaCharacteristic) =>
          tmaCharacteristic.name === LogicalResourceType.MSISDN
      ));
  }

  protected hasAppointment(entry: TmaOrderEntry): boolean {
    return !!(entry && entry.appointment && entry.appointment.id);
  }
}
