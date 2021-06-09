import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TmaCartEntryAdapter } from '../../../cart/store/adapters';
import { TmaOccCartEntryAdapter } from './tma-occ-cart-entry.adapter';
import { CartOccModule, CartAdapter } from '@spartacus/core';
import { TmaOccCartAdapter } from './tma-occ-cart.adapter';
import { TmaOccCartNormalizer } from './converters';
import { TMA_CART_NORMALIZER } from '../../../cart/connectors/converters';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: TmaCartEntryAdapter,
      useClass: TmaOccCartEntryAdapter
    },
    {
      provide: CartAdapter,
      useClass: TmaOccCartAdapter
    },
    {
      provide: TMA_CART_NORMALIZER,
      useExisting: TmaOccCartNormalizer,
      multi: true
    }
  ]
})
export class TmaOccCartModule extends CartOccModule {}
