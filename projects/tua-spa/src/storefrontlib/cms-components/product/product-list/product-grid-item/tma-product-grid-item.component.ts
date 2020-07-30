/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductGridItemComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-grid-item',
  templateUrl: './tma-product-grid-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductGridItemComponent extends ProductGridItemComponent {
}
