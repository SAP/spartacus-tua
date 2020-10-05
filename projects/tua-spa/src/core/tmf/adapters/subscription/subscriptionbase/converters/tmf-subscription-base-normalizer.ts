import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { SubscriptionBase } from '../../../../../model';
import { Tmf } from '../../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfSubscriptionBaseNormalizer
  implements Converter<Tmf.TmfSubscriptionBase, SubscriptionBase> {
  constructor() {}

  convert(
    source: Tmf.TmfSubscriptionBase,
    target?: SubscriptionBase
  ): SubscriptionBase {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
