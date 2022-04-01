import { TmaProductOrderStoreModule } from './store/tma-product-order-store.module';
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
  imports: [TmaProductOrderStoreModule]
})
export class TmaProductOrderModule {
  static forRoot(): ModuleWithProviders<TmaProductOrderStoreModule> {
    return {
      ngModule: TmaProductOrderModule
    };
  }
}
