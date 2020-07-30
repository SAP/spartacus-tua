/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaChecklistAction } from '../../model/tma-checklist-action.model';

export const TMA_CHECKLIST_ACTION_NORMALIZER = new InjectionToken<Converter<any, TmaChecklistAction>>('TmaChecklistActionNormalizer');
