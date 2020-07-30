/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TmaCartEntryAdapter } from '../../../cart/store/adapters';
import { TmaOccCartEntryAdapter } from './tma-occ-cart-entry.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: TmaCartEntryAdapter,
      useClass: TmaOccCartEntryAdapter
    }
  ]
})
export class TmaOccCartModule { }
