/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Order } from '@spartacus/core';
import { TmaCartPrice, TmaOrderEntry } from './tma-cart.entry.model';

export interface TmaOrder extends Order {
    entries?: TmaOrderEntry[];
    unconsignedEntries?: TmaOrderEntry[];
    orderCosts: TmaCartPrice[];
}
