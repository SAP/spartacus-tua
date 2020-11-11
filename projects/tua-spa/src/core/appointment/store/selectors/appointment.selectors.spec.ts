import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import {
  StateWithAppointment,
  APPOINTMENT_FEATURE,
} from '../appointment-state';

import { AppointmentSelectors } from '.';
import { Appointment } from '../../..';
import { reducerProvider, reducerToken } from '../reducers';

describe('Appointment Selectors', () => {
  let store: Store<StateWithAppointment>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(APPOINTMENT_FEATURE, reducerToken, {}),
      ],
      providers: [reducerProvider],
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });
  describe('getAppointmentState', () => {
    it('should return the appointment state from the store', () => {
      let result: Appointment;
      store
        .pipe(select(AppointmentSelectors.getAppointmentById))
        .subscribe((value) => (result = value));
      expect(result).not.toBeNull();
    });
  });
});
