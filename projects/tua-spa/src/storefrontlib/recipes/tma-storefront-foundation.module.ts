import { NgModule } from '@angular/core';
import { TmaAuthModule } from '../../core/auth';
import { TmaRoutingModule } from '../cms-structure/routing';
import { TmaBillingFrequencyConfigModule } from '../../core/billing-frequency/tma-billing-frequency.module';

@NgModule({
  imports: [
    TmaAuthModule.forRoot(),
    TmaRoutingModule.forRoot(),
    TmaBillingFrequencyConfigModule.forRoot(),
  ],
  exports: [],
  providers: [],
})
export class TmaStorefrontFoundationModule {
}
