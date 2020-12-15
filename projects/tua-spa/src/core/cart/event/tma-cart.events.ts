import { TmaOrderEntry } from '../../model';
import { CartEvent } from '@spartacus/core';


export class TmaCartAddEntryEvent implements CartEvent {
  cartId: string;
  userId: string;
  cartEntry: TmaOrderEntry;
}
