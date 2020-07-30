/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaChecklistActionStoreModule } from './store/tma-checklist-action-store.module';
import { TmaChecklistActionService } from './facade';

@NgModule({
  imports: [TmaChecklistActionStoreModule],
})
export class TmaChecklistActionModule {
  static forRoot(): ModuleWithProviders<TmaChecklistActionModule> {
    return {
      ngModule: TmaChecklistActionModule,
      providers: [TmaChecklistActionService]
    };
  }
}
