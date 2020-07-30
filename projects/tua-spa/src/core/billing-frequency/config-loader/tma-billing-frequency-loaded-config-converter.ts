/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Injectable } from '@angular/core';
import { TmaBillingFrequencyLoadedConfig } from './tma-billing-frequency-loaded-config';

@Injectable({ providedIn: 'root' })
export class TmaBillingFrequencyLoadedConfigConverter {

  fromBillingFrequencyConfig(billingFrequencyConfig: TmaBillingFrequencyLoadedConfig): TmaBillingFrequencyLoadedConfig {
    return {
      billingFrequency: billingFrequencyConfig.billingFrequency,
    };
  }
}
