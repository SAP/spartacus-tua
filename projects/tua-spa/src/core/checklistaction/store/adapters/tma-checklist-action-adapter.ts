/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Observable } from 'rxjs';
import { TmaChecklistAction } from '../../../model/tma-checklist-action.model';

export abstract class TmaChecklistActionAdapter {

  /**
   * Abstract method used to get the checklist actions
   * @param baseSiteId The identifier of the base site
   * @param productId The identifier of the product
   */
  abstract getChecklistActions(
    baseSiteId: string,
    productId: string,
  ): Observable<TmaChecklistAction[]>;
}
