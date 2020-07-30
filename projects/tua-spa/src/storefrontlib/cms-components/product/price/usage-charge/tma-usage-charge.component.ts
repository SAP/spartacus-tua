/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../core/model';

interface TmaPriceMap {
  [key: string]: TmaProductOfferingPrice[];
}

@Component({
  selector: 'cx-usage-charge',
  templateUrl: './tma-usage-charge.component.html',
  styleUrls: ['./tma-usage-charge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaUsageChargeComponent {

  @Input()
  eachRespectiveTierUcList: TmaPriceMap[];

  @Input()
  highestApplicableTierUcList: TmaPriceMap[];

  @Input()
  notApplicableUcList: TmaPriceMap[];

  @Input()
  volumeChargeList: TmaPriceMap[];

  constructor(
  ) {
  }
}
