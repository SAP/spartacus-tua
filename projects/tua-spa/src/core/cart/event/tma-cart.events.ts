import { CartEvent } from '@spartacus/core';
import { TmaOrderEntry } from '../../model';

export class TmaCartAddEntryEvent implements CartEvent {
  cartId: string;
  userId: string;
  cartCode: string;
  cartEntry: TmaOrderEntry;
}
