import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigModule, FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { AddToCartModule, IconModule, ItemCounterModule, PromotionsModule, SpinnerModule } from '@spartacus/storefront';
import { TmaAddToCartComponent } from './tma-add-to-cart.component';
import { TmaAddedToCartDialogComponent } from './added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { TmaCartSharedModule } from '../cart-shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  JourneyChecklistAppointmentDisplayModule,
  JourneyChecklistInstallationAddressDisplayModule,
  JourneyChecklistLogicalResourceDisplayModule
} from '../../journey-checklist';
import { TmaPremiseDetailsModule } from '../../premise-details';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TmaProductSpecificationModule } from '../../product/tma-product-specification';

@NgModule({
  imports: [
    TmaCartSharedModule,
    CommonModule,
    RouterModule,
    SpinnerModule,
    NgxSpinnerModule,
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
    FormsModule,
    ReactiveFormsModule,
    TmaPremiseDetailsModule,
    JourneyChecklistLogicalResourceDisplayModule,
    JourneyChecklistAppointmentDisplayModule,
    JourneyChecklistInstallationAddressDisplayModule,
    TmaProductSpecificationModule
  ],
  declarations: [TmaAddToCartComponent, TmaAddedToCartDialogComponent],
  entryComponents: [TmaAddToCartComponent, TmaAddedToCartDialogComponent],
  exports: [TmaAddToCartComponent, TmaAddedToCartDialogComponent]
})
export class TmaAddToCartModule extends AddToCartModule {
}
