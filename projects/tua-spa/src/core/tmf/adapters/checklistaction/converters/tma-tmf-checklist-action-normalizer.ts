/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaChecklistAction } from '../../../../model/tma-checklist-action.model';
import { Tmf } from '../../../tmf-models/tmf.models';

@Injectable({ providedIn: 'root' })
export class TmaTmfChecklistActionNormalizer implements Converter<Tmf.TmaChecklistAction, TmaChecklistAction> {
  constructor() {
  }

  convert(source: Tmf.TmaChecklistAction, target?: TmaChecklistAction): TmaChecklistAction {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
