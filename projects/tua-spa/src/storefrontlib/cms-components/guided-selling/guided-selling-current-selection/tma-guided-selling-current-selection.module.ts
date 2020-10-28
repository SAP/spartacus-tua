import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule, OutletModule, PromotionsModule, SpinnerModule } from '@spartacus/storefront';
import { FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TmaGuidedSellingAddSelectionComponent } from './guided-selling-add-selection/tma-guided-selling-add-selection.component';
import { TmaGuidedSellingCurrentSelectionComponent } from './guided-selling-current-selection/tma-guided-selling-current-selection.component';
import { TmaGuidedSellingAddedToCartDialogComponent } from './guided-selling-added-to-cart-dialog/tma-guided-selling-added-to-cart-dialog.component';
import { TmaCartSharedModule } from '../../cart/cart-shared';
import { RouterModule } from '@angular/router';
import { TmaPriceDisplayModule } from '../../product/price/price-display/tma-price-display.module';
import { TmaDiscountDisplayModule } from '../../../shared/components/discount-display';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    BrowserAnimationsModule,
    IconModule,
    PromotionsModule,
    SpinnerModule,
    FeaturesConfigModule,
    UrlModule,
    RouterModule,
    TmaCartSharedModule,
    TmaPriceDisplayModule,
    TmaDiscountDisplayModule
  ],
  declarations: [
    TmaGuidedSellingAddSelectionComponent,
    TmaGuidedSellingCurrentSelectionComponent,
    TmaGuidedSellingAddedToCartDialogComponent
  ],
  exports: [
    TmaGuidedSellingAddSelectionComponent,
    TmaGuidedSellingCurrentSelectionComponent,
    TmaGuidedSellingAddedToCartDialogComponent
  ],
  entryComponents: [
    TmaGuidedSellingAddedToCartDialogComponent
  ]
})
export class TmaGuidedSellingCurrentSelectionModule { }
