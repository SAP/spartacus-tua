/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
export interface TmaBillingFrequencyMap {
  key: string,
  value: number,
}

export abstract class TmaBillingFrequencyConfig {
  billingFrequency?: TmaBillingFrequencyMap[];
}
