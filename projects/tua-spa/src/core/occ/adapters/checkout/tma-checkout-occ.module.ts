import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CheckoutAdapter } from "@spartacus/checkout/core";
import { CheckoutOccModule } from "@spartacus/checkout/occ";
import { TMA_ORDER_NORMALIZER } from '../../../checkout/connectors';
import { TmaOccOrderNormalizer } from './converters';
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
export class TmaCheckoutOccModule extends CheckoutOccModule { }
