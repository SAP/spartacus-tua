/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmaGuidedSellingStepsModule } from './guided-selling-steps/tma-guided-selling-steps.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutletModule } from '@spartacus/storefront';
import { I18nModule, ConfigModule } from '@spartacus/core';
import { TmaGuidedSellingComponent } from './tma-guided-selling.component';
import { TmaGuidedSellingContentModule } from './guided-selling-content';
import { TmaGuidedSellingCurrentSelectionModule } from './guided-selling-current-selection';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    TmaGuidedSellingStepsModule,
    TmaGuidedSellingContentModule,
    TmaGuidedSellingCurrentSelectionModule,
    ConfigModule.withConfig({
      cmsComponents: {
        GuidedSellingComponent: {
          component: TmaGuidedSellingComponent
        }
      }
    })
  ],
  exports: [
    TmaGuidedSellingComponent,
    TmaGuidedSellingStepsModule,
    TmaGuidedSellingContentModule,
    TmaGuidedSellingCurrentSelectionModule
  ],
  declarations: [TmaGuidedSellingComponent],
  entryComponents: [TmaGuidedSellingComponent]
})
export class TmaGuidedSellingModule { }
