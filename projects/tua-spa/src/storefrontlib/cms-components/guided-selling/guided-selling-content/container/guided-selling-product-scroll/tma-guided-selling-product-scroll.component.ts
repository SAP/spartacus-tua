/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductListComponentService } from '@spartacus/storefront';
import { TmaProductScrollComponent } from '../../../../product/product-list';

@Component({
  selector: 'cx-guided-selling-product-scroll',
  templateUrl: './tma-guided-selling-product-scroll.component.html',
  styleUrls: ['./tma-guided-selling-product-scroll.component.scss']
})
export class TmaGuidedSellingProductScrollComponent extends TmaProductScrollComponent {

  constructor(
    protected tmaProductListComponentService: ProductListComponentService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(tmaProductListComponentService, changeDetectorRef);
  }
}
