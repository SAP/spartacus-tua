/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { LayoutConfig } from '@spartacus/storefront';

export const tmaB2cLayoutConfig: LayoutConfig = {
  layoutSlots: {
    GuidedSellingPageTemplate: {
      slots: [
        'GuidedSellingContentSlot',
      ],
    },
  },
};