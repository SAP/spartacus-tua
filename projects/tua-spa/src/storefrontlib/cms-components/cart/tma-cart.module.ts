import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TmaCartDetailsModule } from './cart-details/tma-cart-details.module';
import { TmaCartSharedModule } from './cart-shared';
import {
  CartComponentModule,
  CartPageLayoutHandler,
  MiniCartModule,
  PAGE_LAYOUT_HANDLER
} from '@spartacus/storefront';
import { CartModule } from '@spartacus/core';
import { TmaCartTotalsModule } from './cart-totals/tma-cart-totals.module';
import { TmaAddToCartModule } from './add-to-cart/tma-add-to-cart.module';

@NgModule({
  imports: [
    NgbModule,
    TmaCartDetailsModule,
    TmaCartTotalsModule,
    TmaCartSharedModule
  ],
  exports: [
    TmaCartDetailsModule,
    TmaCartTotalsModule,
    TmaCartSharedModule,
    TmaAddToCartModule,
    MiniCartModule,
    CartModule
  ],
  declarations: [],
  providers: [
    {
      provide: PAGE_LAYOUT_HANDLER,
      useExisting: CartPageLayoutHandler,
      multi: true
    }
  ]
})
export class TmaCartComponentModule extends CartComponentModule { }
