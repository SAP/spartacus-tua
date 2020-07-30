/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ModuleWithProviders, NgModule } from '@angular/core';
import { defaultTmaRoutingConfig } from './tma-default-routing-config';
import { CmsRouteModule } from '@spartacus/storefront';
import { provideConfig, RoutingModule, RoutingModule as CoreRoutingModule } from '@spartacus/core';

@NgModule({
  imports: [
    CoreRoutingModule.forRoot(), CmsRouteModule]
})
export class TmaRoutingModule extends RoutingModule {
  static forRoot(): ModuleWithProviders<TmaRoutingModule> {
    return {
      ngModule: TmaRoutingModule,
      providers: [provideConfig(defaultTmaRoutingConfig)]
    };
  }
}
