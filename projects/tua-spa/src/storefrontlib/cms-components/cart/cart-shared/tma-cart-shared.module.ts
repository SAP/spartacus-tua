import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { CartCouponModule, CartSharedModule, ItemCounterModule, MediaModule, PromotionsModule, SpinnerModule } from '@spartacus/storefront';
import { TmaOrderSummaryComponent } from './order-summary/tma-order-summary.component';
import { TmaCartItemComponent } from './cart-item/tma-cart-item.component';
import { TmaCartItemListComponent } from './cart-item-list/tma-cart-item-list.component';

@NgModule({
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    CartCouponModule,
    ReactiveFormsModule,
    UrlModule,
    NgbModule,
    PromotionsModule,
    I18nModule,
    MediaModule,
    ItemCounterModule,
    FeaturesConfigModule,
    SpinnerModule,
  ],
  declarations: [
    TmaCartItemComponent,
    TmaCartItemListComponent,
    TmaOrderSummaryComponent,
  ],
  exports: [TmaCartItemComponent, TmaCartItemListComponent, TmaOrderSummaryComponent],
})
export class TmaCartSharedModule extends CartSharedModule {
}
