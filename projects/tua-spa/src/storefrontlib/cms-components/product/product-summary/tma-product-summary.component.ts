/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrentProductService, ProductSummaryComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaProduct } from '../../../../core/model';
import { TmaPriceService } from '../../../../core/product/facade';

@Component({
  selector: 'cx-product-summary',
  templateUrl: './tma-product-summary.component.html',
  styleUrls: ['./tma-product-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductSummaryComponent extends ProductSummaryComponent {

  product$: Observable<TmaProduct>;

  constructor(
    public priceService: TmaPriceService,
    protected currentProductService: CurrentProductService,
  ) {
    super(currentProductService);
  }
}
