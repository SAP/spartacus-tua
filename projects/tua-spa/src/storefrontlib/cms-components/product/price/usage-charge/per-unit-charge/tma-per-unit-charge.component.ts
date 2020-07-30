/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaPriceService } from '../../../../../../core/product/facade';
import { TmaProductOfferingPrice } from '../../../../../../core/model';

@Component({
  selector: 'cx-per-unit-charge',
  templateUrl: './tma-per-unit-charge.component.html',
  styleUrls: ['./tma-per-unit-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaPerUnitChargeComponent {

  @Input()
  priceList: TmaProductOfferingPrice[];

  constructor(
    public priceService: TmaPriceService
  ) {
  }
}

