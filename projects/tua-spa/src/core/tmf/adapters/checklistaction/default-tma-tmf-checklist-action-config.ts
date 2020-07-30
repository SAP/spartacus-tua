/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmfConfig } from '../../config/tmf-config';

export const defaultTmaTmfChecklistActionConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        checklistAction:
          'checklistAction',
      },
    },
  },
};
