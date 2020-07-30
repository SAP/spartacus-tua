/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmaTmfCartStoreModule } from './store/tma-tmf-cart-store.module';
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
  imports: [TmaTmfCartStoreModule]
})
export class TmaTmfCartModule {
  static forRoot(): ModuleWithProviders<TmaTmfCartModule> {
    return {
      ngModule: TmaTmfCartModule
    };
  }
}
