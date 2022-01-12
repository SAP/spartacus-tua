import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { SearchTimeSlot } from '../../../../model';
import { TmfAppointmentApiModel } from '../../../tmf-appointment-models';

@Injectable({
  providedIn: 'root',
})
export class TmfSearchTimeSlotNormalizer
  implements Converter<TmfAppointmentApiModel.TmfSearchTimeSlot, SearchTimeSlot> {
  constructor() {}

  convert(
    source: TmfAppointmentApiModel.TmfSearchTimeSlot,
    target?: SearchTimeSlot
  ): SearchTimeSlot {
    if (target === undefined) {
      target = { ...(source as any) };
    }
    return target;
  }
}
