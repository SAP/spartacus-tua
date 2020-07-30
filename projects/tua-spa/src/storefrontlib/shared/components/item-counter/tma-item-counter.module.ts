/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ItemCounterModule, OnlyNumberDirectiveModule } from '@spartacus/storefront';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaItemCounterComponent } from './tma-item-counter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OnlyNumberDirectiveModule
  ],
  declarations: [TmaItemCounterComponent],
  exports: [TmaItemCounterComponent]
})
export class TmaItemCounterModule extends ItemCounterModule { }
