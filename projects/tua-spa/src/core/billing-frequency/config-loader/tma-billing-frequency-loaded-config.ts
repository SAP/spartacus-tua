/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmaBillingFrequencyMap } from '../../billing-frequency/config/tma-billing-frequency-config';

export interface TmaBillingFrequencyLoadedConfig {
  /**
   * List of billing frequency maps
   */
  billingFrequency: TmaBillingFrequencyMap[],
}
