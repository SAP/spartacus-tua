import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ConfigModule,
  FeaturesConfigModule,
  I18nModule,
  UrlModule
} from '@spartacus/core';
import {
  AddToCartModule,
  AutoFocusDirectiveModule,
  IconModule,
  ItemCounterModule,
  PromotionsModule,
  SpinnerModule
} from '@spartacus/storefront';
import { JourneyChecklistComponentModule } from '../../journey-checklist/journey-checklist.module';
import { TmaPremiseDetailsModule } from '../../premise-details';
import { TmaCartSharedModule } from '../cart-shared';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { TmaAddToCartComponent } from './tma-add-to-cart.component';

@NgModule({
  imports: [
    TmaCartSharedModule,
    CommonModule,
    RouterModule,
    SpinnerModule,
    PromotionsModule,
    JourneyChecklistComponentModule,
    FeaturesConfigModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductAddToCartComponent: {
          component: TmaAddToCartComponent,
        },
      },
    }),
    UrlModule,
    IconModule,
    I18nModule,
    ItemCounterModule,
    AutoFocusDirectiveModule,
    TmaPremiseDetailsModule,
    JourneyChecklistComponentModule,
  ],
  declarations: [TmaAddToCartComponent, TmaAddedToCartDialogComponent],
  entryComponents: [TmaAddToCartComponent, TmaAddedToCartDialogComponent],
  exports: [TmaAddToCartComponent, TmaAddedToCartDialogComponent],
})
export class TmaAddToCartModule extends AddToCartModule {}
