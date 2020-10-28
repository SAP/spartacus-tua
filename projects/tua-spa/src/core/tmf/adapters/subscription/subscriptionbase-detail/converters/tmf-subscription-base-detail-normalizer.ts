import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Tmf } from '../../../../tmf-models/tmf.models';
import { SubscriptionBaseDetail } from '../../../../../model';

@Injectable({ providedIn: 'root' })
export class TmfSubscriptionBaseDetailNormalizer
  implements Converter<Tmf.TmfSubscriptionBaseDetail, SubscriptionBaseDetail> {
  constructor() {}

  convert(
    source: Tmf.TmfSubscriptionBaseDetail,
    target?: SubscriptionBaseDetail
  ): SubscriptionBaseDetail {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
