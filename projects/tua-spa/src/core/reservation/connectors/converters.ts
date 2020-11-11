import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Reservation } from '../../model';

export const RESERVATION_NORMALIZER = new InjectionToken<Converter<any, Reservation>>('ReservationNormalizer');
