import { Injectable } from '@angular/core';
import {
  TmaTmfRelatedParty,
  TmaProduct,
  ResourceRef,
  Reservation
} from '../../model';
import { StateWithReservation, ReservationAction } from '../store';
import { UserService, OCC_USER_ID_ANONYMOUS } from '@spartacus/core';
import { LOCAL_STORAGE } from '../../util';
import { AvailabilityCheckService } from '../../availability-check/facade';
import { LogicalResourceReservationService } from './logical-resource-reservation.service';
import { Store } from '@ngrx/store';
import { JourneyChecklistConfig } from '../../journey-checklist-config/config';

const { MSISDN_TYPE } = LOCAL_STORAGE.MSISDN_RESERVATION;

@Injectable()
export class MsisdnReservationService extends LogicalResourceReservationService {
  protected currentUser: TmaTmfRelatedParty;

  constructor(
    protected store: Store<StateWithReservation>,
    protected userService: UserService,
    protected availabilityCheckService: AvailabilityCheckService,
    protected config: JourneyChecklistConfig
  ) {
    super(store, userService);
  }

  /**
   * Create reservation for selected MSISDN by customer from the list of available MSISDNs
   *
   * @param product - The product for which the MSISDN will be reserved
   */
  public createReservationForMsisdn(product: TmaProduct): void {
    const selectedMsisdn: ResourceRef = this.availabilityCheckService.getSelectedLogicalResource();
    if (!selectedMsisdn) {
      return;
    }
    let reservation: Reservation;
    if (
      this.currentUser.id === OCC_USER_ID_ANONYMOUS ||
      this.currentUser.id === undefined
    ) {
      reservation = {
        productOffering: {
          id: product.code,
          name: product.name
        },
        reservationItem: [
          {
            quantity: this.config.journeyChecklist.msisdn_reservation
              .msisdn_qty,
            resourceCapacity: [
              {
                capacityDemandAmount: this.config.journeyChecklist
                  .msisdn_reservation.msisdn_capacity_amount_demand,
                type: MSISDN_TYPE
              }
            ],
            appliedCapacityAmount: [
              {
                appliedCapacityAmount: this.config.journeyChecklist
                  .msisdn_reservation
                  .applied_capacity_amount_for_msisdn_reservation,
                resource: Object.values(selectedMsisdn)
              }
            ]
          }
        ]
      };
    }
    else {
      reservation = {
        relatedParty: [
          {
            id:
              this.currentUser.id === undefined
                ? OCC_USER_ID_ANONYMOUS
                : this.currentUser.id,
            role: this.currentUser.role
          }
        ],
        productOffering: {
          id: product.code,
          name: product.name
        },
        reservationItem: [
          {
            quantity: this.config.journeyChecklist.msisdn_reservation.msisdn_qty,
            resourceCapacity: [
              {
                capacityDemandAmount: this.config.journeyChecklist
                  .msisdn_reservation.msisdn_capacity_amount_demand,
                type: MSISDN_TYPE
              }
            ],
            appliedCapacityAmount: [
              {
                appliedCapacityAmount: this.config.journeyChecklist
                  .msisdn_reservation
                  .applied_capacity_amount_for_msisdn_reservation,
                resource: Object.values(selectedMsisdn)
              }
            ]
          }
        ]
      };
    }
    this.store.dispatch(new ReservationAction.CreateReservation(reservation));
  }
}
