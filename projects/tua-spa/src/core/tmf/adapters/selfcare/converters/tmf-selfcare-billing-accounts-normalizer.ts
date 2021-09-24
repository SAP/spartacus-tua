import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaSelfcareBillingAccounts } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfSelfcareBillingAccountsNormalizer
  implements
    Converter<Tmf.TmfSelfcareBillingAccounts, TmaSelfcareBillingAccounts>
{
  constructor() {}

  /**
   * Converts {@link Tmf.TmfSelfcareBillingAccounts} to {@link TmaSelfcareBillingAccounts}.
   *
   * @param source - The object which will be used to retrieve the values from
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaSelfcareBillingAccounts}
   */
  convert(
    source: Tmf.TmfSelfcareBillingAccounts,
    target?: TmaSelfcareBillingAccounts
  ): TmaSelfcareBillingAccounts {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
