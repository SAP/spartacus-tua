import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CheckoutOccModule, CheckoutAdapter } from '@spartacus/core';
import { TmaOccOrderNormalizer } from './converters';
import { TMA_ORDER_NORMALIZER } from '../../../checkout/connectors';
import { TmaOccCheckoutAdapter } from './tma-occ-checkout.adapter';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: CheckoutAdapter,
      useClass: TmaOccCheckoutAdapter
    },
    {
      provide: TMA_ORDER_NORMALIZER,
      useExisting: TmaOccOrderNormalizer,
      multi: true
    }
  ]
})
export class TmaCheckoutOccModule extends CheckoutOccModule {}
