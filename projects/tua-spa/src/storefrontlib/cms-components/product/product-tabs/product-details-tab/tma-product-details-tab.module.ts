/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { TmaProductDetailsTabComponent } from './tma-product-details-tab.component';
import { TmaPriceModule } from '../../price';


@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductDetailsTabComponent: {
          component: TmaProductDetailsTabComponent
        }
      }
    }),
    I18nModule,
    TmaPriceModule
  ],
  declarations: [TmaProductDetailsTabComponent],
  entryComponents: [TmaProductDetailsTabComponent],
  exports: [TmaProductDetailsTabComponent]
})
export class TmaProductDetailsTabModule { }
