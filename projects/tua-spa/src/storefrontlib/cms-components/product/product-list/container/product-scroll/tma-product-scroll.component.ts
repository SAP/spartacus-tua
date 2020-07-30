/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductListComponentService, ProductScrollComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-scroll',
  templateUrl: './tma-product-scroll.component.html',
})
export class TmaProductScrollComponent extends ProductScrollComponent {

  constructor(
    protected tmaProductListComponentService: ProductListComponentService,
    protected tmaRef: ChangeDetectorRef
  ){
    super(tmaProductListComponentService, tmaRef)
  }
}
