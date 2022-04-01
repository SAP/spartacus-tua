import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaCheckoutStoreModule } from './store/tma-checkout-store.module';

@NgModule({
  imports: [TmaCheckoutStoreModule]
})
export class TmaCheckoutModule {
  static forRoot(): ModuleWithProviders<TmaCheckoutModule> {
    return {
      ngModule: TmaCheckoutModule,
      providers: []
    };
  }
}
