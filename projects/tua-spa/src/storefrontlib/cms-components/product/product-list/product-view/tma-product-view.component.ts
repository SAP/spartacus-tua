/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { ProductViewComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-view',
  templateUrl: './tma-product-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductViewComponent extends ProductViewComponent {
}
