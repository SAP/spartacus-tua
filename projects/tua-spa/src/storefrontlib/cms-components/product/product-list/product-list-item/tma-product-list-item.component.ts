/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductListItemComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-list-item',
  templateUrl: './tma-product-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductListItemComponent extends ProductListItemComponent {
}
