import { Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { UserService, User } from '@spartacus/core';
import { take, tap, filter, takeUntil } from 'rxjs/operators';
import {
  StateWithAppointment,
  AppointmentSelectors,
  AppointmentActions
} from '../store';
import {
  TmaTmfRelatedParty,
  Appointment,
  AppointmentStateType,
  SearchTimeSlot
} from '../../model';
import { SearchTimeSlotService } from '../../search-time-slot';
import { GeographicAddressService } from '../../geographic-address';

@Injectable()
export class AppointmentService implements OnDestroy {
  protected destroyed$ = new Subject();
  protected currentCustomer: TmaTmfRelatedParty;

  constructor(
    protected store: Store<StateWithAppointment>,
    protected userService: UserService,
    protected searchTimeSlotService: SearchTimeSlotService,
    protected geographicAddressService: GeographicAddressService
  ) {
    this.userService
      .get()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: User) => {
        this.currentCustomer = {
          id: user.uid,
          role: 'CUSTOMER',
          name: user.name
        };
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * This method is used to get the appointment for given id.
   * @param id the id
   * @return the appointment
   */
  getAppointmentById(id: string): Observable<Appointment> {
    return this.store.pipe(
      select(AppointmentSelectors.getAppointmentById, { id }),
      tap((appointment: Appointment) => {
        if (
          appointment === undefined ||
          Object.keys(appointment).length === 0
        ) {
          this.loadAppointmentById(id);
        }
      })
    );
  }

  /**
   * This method is used to load the appointment.
   * @param id the id
   */
  loadAppointmentById(id: string): void {
    this.store.dispatch(
      new AppointmentActions.LoadAppointment({
        id: id,
      })
    );
  }

  /**
   * This method is used to create the appointment.
   */
  createAppointmentForTimeSlot(): void {
    const selectedTimeSlot: SearchTimeSlot = this.getTimeSlot();
    const appointmentRequest: Appointment = this.populateAppointmentRequest(
      selectedTimeSlot
    );
    this.store.dispatch(
      new AppointmentActions.CreateAppointment({
        appointment: appointmentRequest
      })
    );
  }

  /**
   * This method is used to get the created appointment.
   * @return the created appointment
   */
  getCreatedAppointment(): Observable<Appointment> {
    return this.store.pipe(select(AppointmentSelectors.getCreatedAppointment));
  }

  /**
   * This method is used to update appointment.
   * @param oldAppointmentId The id of the appointment
   */
  updateAppointment(oldAppointmentId: string): void {
    const selectedTimeSlot: SearchTimeSlot = this.getTimeSlot();
    const appointmentRequest: Appointment = this.populateAppointmentRequest(
      selectedTimeSlot
    );
    this.store.dispatch(
      new AppointmentActions.UpdateAppointment({
        id: oldAppointmentId,
        appointment: appointmentRequest
      })
    );
  }

  /**
   * This method cancels the appointment.
   *
   * @param appointmentId The id of the appointment which needs to be cancelled
   */
  cancelAppointment(appointmentId: string): void {
    this.store.dispatch(
      new AppointmentActions.UpdateAppointment({
        id: appointmentId,
        appointment: {
          status: AppointmentStateType.CANCELLED,
        }
      })
    );
  }

  /**
   * This method is used to clear the created appointment state.
   */
  clearCreatedAppointmentState(): void {
    this.store.dispatch(new AppointmentActions.ClearCreatedAppointment());
  }

  /**
   * This method is used to clear the appointment state.
   */
  clearAppointmentState(): void {
    this.store.dispatch(new AppointmentActions.ClearAppointmentState());
  }

  /**
   * This method is used to clear the appointment error.
   */
  clearAppointmentError(): void {
    this.store.dispatch(new AppointmentActions.ClearAppointmentError());
  }

  /**
   * This method is used to determine error for an appointment id
   */
  getAppointmentErrorForID(id: string): Observable<string> {
    return this.store.pipe(
      select(AppointmentSelectors.getAppointmentErrorForAppointmentID, { id })
    );
  }

  /**
   * This method is used to determine error during appointment creation.
   */
  getCreateAppointmentError(): Observable<string> {
    return this.store.pipe(
      select(AppointmentSelectors.getCreateAppointmentError)
    );
  }

  /**
   * This method is used to determine if any appointment has error.
   */
  hasAppointmentError(): Observable<boolean> {
    return this.store.pipe(select(AppointmentSelectors.getAppointmentError));
  }

  /**
   * This method is used to determine the appointment error during update.
   */
  getUpdateAppointmentError(id: string): Observable<string> {
    return this.store.pipe(
      select(AppointmentSelectors.getUpdateAppointmentError, { id })
    );
  }

  /**
   * This method is used to determine if there are any cancelled appointment.
   */
  hasCancelledAppointment(): Observable<boolean> {
    return this.store.pipe(
      select(AppointmentSelectors.getCancelledAppointment)
    );
  }

  protected populateAppointmentRequest(
    searchTimeSlot: SearchTimeSlot
  ): Appointment {
    const selectedTimeSlot = searchTimeSlot.requestedTimeSlot[0];
    return {
      validFor: {
        startDateTime: selectedTimeSlot.validFor.startDateTime,
        endDateTime: selectedTimeSlot.validFor.endDateTime
      },
      relatedParty: [
        {
          id: selectedTimeSlot.relatedParty.id,
          role: selectedTimeSlot.relatedParty.role,
          name: selectedTimeSlot.relatedParty.name
        },
        {
          id: this.currentCustomer.id,
          role: this.currentCustomer.role,
          name: this.currentCustomer.name
        }
      ],
      relatedPlace: searchTimeSlot.relatedPlace
    };
  }

  private getTimeSlot(): SearchTimeSlot {
    let selectedTimeSlot: SearchTimeSlot;
    this.searchTimeSlotService
      .getSelectedTimeSlot()
      .pipe(
        take(1),
        filter((result: SearchTimeSlot) => !!result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: SearchTimeSlot) => {
        selectedTimeSlot = result;
      });
    return selectedTimeSlot;
  }
}
