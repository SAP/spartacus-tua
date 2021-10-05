import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaSelfcareSubscriptions } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfSelfcareSubscriptionsNormalizer
  implements Converter<Tmf.TmfSelfcareSubscriptions, TmaSelfcareSubscriptions>
{
  constructor() {}

  /**
   * Converts {@link Tmf.TmfSelfcareSubscriptions} to {@link TmaSelfcareSubscriptions}.
   *
   * @param source - The object which will be used to retrieve the values from
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaSelfcareSubscriptions}
   */
  convert(
    source: Tmf.TmfSelfcareSubscriptions,
    target?: TmaSelfcareSubscriptions
  ): TmaSelfcareSubscriptions {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
