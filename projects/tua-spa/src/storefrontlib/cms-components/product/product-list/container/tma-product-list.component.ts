/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Component } from '@angular/core';
import { PageLayoutService, ProductListComponent, ProductListComponentService, ViewConfig } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-list',
  templateUrl: './tma-product-list.component.html',
})
export class TmaProductListComponent extends ProductListComponent {

  constructor(
    protected pageService: PageLayoutService,
    protected productListService: ProductListComponentService,
    protected viewConfig?: ViewConfig,
  ) {
    super(pageService, productListService, viewConfig);
  }
}
