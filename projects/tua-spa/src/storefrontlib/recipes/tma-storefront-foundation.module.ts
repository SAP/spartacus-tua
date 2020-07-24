import { NgModule } from '@angular/core';
import { TmaAuthModule } from '../../core/auth';
import { TmaRoutingModule } from '../cms-structure/routing';
import { TmaBillingFrequencyConfigModule } from '../../core/billing-frequency/tma-billing-frequency.module';
import { TmaTmfCartModule } from '../../core/tmf-cart';

@NgModule({
  imports: [
    TmaAuthModule.forRoot(),
    TmaRoutingModule.forRoot(),
    TmaBillingFrequencyConfigModule.forRoot(),
    TmaTmfCartModule.forRoot()
  ],
  exports: [],
  providers: []
})
export class TmaStorefrontFoundationModule { }
