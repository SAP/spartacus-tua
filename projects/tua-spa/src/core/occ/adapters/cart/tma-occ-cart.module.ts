import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { OccCartNormalizer } from '@spartacus/core';
import { TMA_CART_MODIFICATION_NORMALIZER } from '../../../cart';
import { TmaCartEntryAdapter } from '../../../cart/store/adapters';
import { TmaOccCartEntryAdapter } from './tma-occ-cart-entry.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: TmaCartEntryAdapter,
      useClass: TmaOccCartEntryAdapter
    },
    {
      provide: TMA_CART_MODIFICATION_NORMALIZER,
      useExisting: OccCartNormalizer,
      multi: true
    }
  ]
})
export class TmaOccCartModule { }
