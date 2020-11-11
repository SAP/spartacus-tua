import { Order } from '@spartacus/core';
import { TmaCartPrice, TmaOrderEntry } from './tma-cart.entry.model';

export interface TmaOrder extends Order {
    entries?: TmaOrderEntry[];
    unconsignedEntries?: TmaOrderEntry[];
    orderCosts: TmaCartPrice[];
}
