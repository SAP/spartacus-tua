import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaCartService } from './facade';
import { TmaCartStoreModule } from './store/tma-cart-store.module';

@NgModule({
    imports: [TmaCartStoreModule],
  })
  export class TmaCartModule {
    static forRoot(): ModuleWithProviders<TmaCartModule> {
      return {
        ngModule: TmaCartModule,
        providers: [TmaCartService]
      };
    }
  }