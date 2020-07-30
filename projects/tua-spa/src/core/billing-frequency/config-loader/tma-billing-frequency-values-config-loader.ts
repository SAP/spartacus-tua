/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { TmaBillingFrequencyConfig, TmaBillingFrequencyMap } from '../config/tma-billing-frequency-config';

@Injectable({ providedIn: 'root' })
export class TmaBillingFrequencyValuesConfigLoader {
  constructor(
    protected config: TmaBillingFrequencyConfig
  ) {
  }

  private get billingFrequency(): TmaBillingFrequencyMap[] {
    return this.config.billingFrequency;
  }

  load() {
    if (!this.config || !this.config.billingFrequency) {
      return throwError(new Error(`Missing config for billing frequency!`));
    }
  }
}
