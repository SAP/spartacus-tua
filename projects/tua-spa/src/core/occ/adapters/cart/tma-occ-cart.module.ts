import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CartAdapter,
  CartEntryAdapter,
  CartOccModule,
  CartVoucherAdapter,
  OccCartVoucherAdapter,
  SaveCartAdapter
} from '@spartacus/core';
import { TMA_CART_NORMALIZER } from '../../../cart/connectors/converters';
import { TmaCartEntryAdapter } from '../../../cart/store/adapters/tma-cart-entry.adapter';
import { TmaOccCartNormalizer } from './converters';
import { TmaOccCartEntryAdapter } from './tma-occ-cart-entry.adapter';
import { TmaOccCartAdapter } from './tma-occ-cart.adapter';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: CartAdapter,
      useClass: TmaOccCartAdapter
    },
    {
      provide: TMA_CART_NORMALIZER,
      useExisting: TmaOccCartNormalizer,
      multi: true
    },
    {
      provide: CartEntryAdapter,
      useClass: TmaOccCartEntryAdapter
    },
    {
      provide: TmaCartEntryAdapter,
      useClass: TmaOccCartEntryAdapter
    },
    {
      provide: CartVoucherAdapter,
      useClass: OccCartVoucherAdapter
    }
  ]
})
export class TmaOccCartModule extends CartOccModule {}
