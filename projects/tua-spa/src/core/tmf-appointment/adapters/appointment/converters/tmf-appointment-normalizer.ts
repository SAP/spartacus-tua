import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Appointment } from '../../../../model';
import { TmfAppointmentApiModel } from '../../../tmf-appointment-models';

@Injectable({
  providedIn: 'root',
})
export class TmfAppointmentNormalizer
  implements Converter<TmfAppointmentApiModel.TmfAppointment, Appointment> {
  constructor() {}

  convert(source: TmfAppointmentApiModel.TmfAppointment, target?: Appointment): Appointment {
    if (target === undefined) {
      target = { ...(source as any) };
    }
    return target;
  }
}
