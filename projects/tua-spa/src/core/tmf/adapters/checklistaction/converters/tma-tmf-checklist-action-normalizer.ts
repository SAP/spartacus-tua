import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaChecklistAction } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmaTmfChecklistActionNormalizer
  implements Converter<Tmf.TmaChecklistAction, TmaChecklistAction> {
  constructor() {}

  convert(
    source: Tmf.TmaChecklistAction,
    target?: TmaChecklistAction
  ): TmaChecklistAction {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
