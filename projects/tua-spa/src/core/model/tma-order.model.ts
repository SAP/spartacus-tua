import { Order } from '@spartacus/core';
import { TmaCartPrice, TmaOrderEntry } from './tma-cart.entry.model';
import { TmaProcessType } from './tma-common.model';

export interface TmaOrder extends Order {
  entries?: TmaOrderEntry[];
  unconsignedEntries?: TmaOrderEntry[];
  orderCosts: TmaCartPrice[];
  processType?: TmaProcessType;
  contractStartDate?: string;
}
