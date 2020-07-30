/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { OutletModule } from '@spartacus/storefront';
import { TmaGuidedSellingStepsComponent } from './tma-guided-selling-steps.component';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule
  ],
  declarations: [TmaGuidedSellingStepsComponent],
  exports: [TmaGuidedSellingStepsComponent]
})
export class TmaGuidedSellingStepsModule { }
