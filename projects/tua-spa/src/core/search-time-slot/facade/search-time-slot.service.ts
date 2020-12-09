import * as SearchTimeSlotActions from '../store/actions/search-time-slot.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RelatedPlaceRef,
  SearchTimeSlot,
  TimeSlot,
  GeographicAddress,
} from '../../model';
import { Store, select } from '@ngrx/store';
import * as SearchTimeSlotSelectors from '../store/selectors/search-time-slot.selector';
import { StateWithSearchTimeSlot } from '../store';
import { JourneyChecklistConfig } from '../../journey-checklist-config/config';

@Injectable({
  providedIn: 'root',
})
export class SearchTimeSlotService {
  constructor(
    protected store: Store<StateWithSearchTimeSlot>,
    protected config?: JourneyChecklistConfig
  ) {}

  /**
   * Returns the available time slots for the requested place.
   *
   * @param place
   *           The installation place of {@link GeographicAddress}
   * @returns Observable<SearchTimeSlot>
   *                the available time slots
   */
  getAvailableTimeSlots(place?: GeographicAddress): Observable<SearchTimeSlot> {
    this.loadSearchTimeSlot(place);
    return this.store.pipe(
      select(SearchTimeSlotSelectors.getAllSearchTimeSlots)
    );
  }

  /**
   * Loads the available time slots for the requested place.
   *
   * @param place
   *            The installation place of {@link GeographicAddress}
   */
  loadSearchTimeSlot(place: GeographicAddress): void {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(
      startDate.getDate() +
        this.config.journeyChecklist.appointment.end_date_of_timeslots
    );

    const searchTimeSlotRequest: SearchTimeSlot = {
      requestedTimeSlot: [
        {
          validFor: {
            startDateTime: startDate,
            endDateTime: endDate,
          },
        },
      ],
      relatedPlace: this.createPlaceRequest(place),
    };
    this.store.dispatch(
      new SearchTimeSlotActions.LoadSearchTimeSlot({
        requestedTimeSlot: searchTimeSlotRequest,
      })
    );
  }

  /**
   * creates the installation address request.
   *
   * @param  place
   *         The place of {@link GeographicAddress}
   * @returns the installation place as {@link RelatedPlaceRef}
   */
  createPlaceRequest(place: GeographicAddress): RelatedPlaceRef {
    if (place === undefined || place.id === undefined) {
      return undefined;
    }
    return {
      id: place.id,
      name: "client's address",
      '@referredType': 'GeographicAddress',
      role: 'interventionAddress',
    };
  }

  /**
   * Sets the selected time slot.
   *
   * @param  timeSlot The selected time slot of {@link TimeSlot}
   */
  setSelectedTimeSlot(timeSlot: TimeSlot): void {
    if (!!timeSlot) {
      this.store.dispatch(
        new SearchTimeSlotActions.SelectedTimeSlotSucess({ timeSlot })
      );
    }
  }

  /**
   * Gets the selected time slot
   *
   * @returns Observable<TimeSlot>
   *                The selected time slot
   */
  getSelectedTimeSlot(): Observable<TimeSlot> {
    return this.store.select(SearchTimeSlotSelectors.getSelectedTimeSlots);
  }
}
