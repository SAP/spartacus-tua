import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import {
  CartCouponModule,
  CartSharedModule,
  MediaModule,
  ModalModule,
  PromotionsModule,
  SpinnerModule
} from '@spartacus/storefront';
import { TmaOrderSummaryComponent } from './order-summary/tma-order-summary.component';
import { TmaCartItemComponent } from './cart-item/tma-cart-item.component';
import { TmaCartItemListComponent } from './cart-item-list/tma-cart-item-list.component';
import { EffectsModule } from '@ngrx/effects';
import { TmaTmfCartEffect } from '../../../../core/tmf-cart/store/effects/tma-tmf-cart.effect';
import { TmaItemCounterModule } from '../../../shared/components/item-counter';
import {
  JourneyChecklistLogicalResourceDisplayModule,
  JourneyChecklistInstallationAddressDisplayModule,
  JourneyChecklistAppointmentDisplayModule
} from '../../journey-checklist';
import { TmaCartItemPriceDisplayModule } from './cart-item-price-display/tma-cart-item-price-display.module';
import { TmaPremiseDetailsModule } from '../../premise-details/components';
import { TmaPurchaseReasonModule } from '../../purchase-reason';

@NgModule({
  providers: [DatePipe],
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
    TmaItemCounterModule,
    FeaturesConfigModule,
    SpinnerModule,
    TmaPremiseDetailsModule,
    TmaPurchaseReasonModule,
    JourneyChecklistLogicalResourceDisplayModule,
    JourneyChecklistAppointmentDisplayModule,
    JourneyChecklistInstallationAddressDisplayModule,
    TmaCartItemPriceDisplayModule,
    EffectsModule.forFeature([TmaTmfCartEffect]),
    ModalModule
  ],
  declarations: [
    TmaCartItemComponent,
    TmaCartItemListComponent,
    TmaOrderSummaryComponent
  ],
  entryComponents: [],
  exports: [
    TmaCartItemComponent,
    TmaCartItemListComponent,
    TmaOrderSummaryComponent
  ]
})
export class TmaCartSharedModule extends CartSharedModule {}
