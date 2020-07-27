import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigModule, FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import {
  AddToCartModule,
  AutoFocusDirectiveModule,
  IconModule,
  ItemCounterModule,
  PromotionsModule,
  SpinnerModule
} from '@spartacus/storefront';
import { TmaAddToCartComponent } from './tma-add-to-cart.component';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { TmaCartSharedModule } from '../cart-shared';

@NgModule({
  imports: [
    TmaCartSharedModule,
    CommonModule,
    RouterModule,
    SpinnerModule,
    PromotionsModule,
    FeaturesConfigModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductAddToCartComponent: {
          component: TmaAddToCartComponent
        }
      }
    }),
    UrlModule,
    IconModule,
    I18nModule,
    ItemCounterModule,
    AutoFocusDirectiveModule
  ],
  declarations: [TmaAddToCartComponent, TmaAddedToCartDialogComponent],
  entryComponents: [TmaAddToCartComponent, TmaAddedToCartDialogComponent],
  exports: [TmaAddToCartComponent, TmaAddedToCartDialogComponent]
})
export class TmaAddToCartModule extends AddToCartModule { }
