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
  PromotionsModule,
  SpinnerModule
} from '@spartacus/storefront';
import { TmaOrderSummaryComponent } from './order-summary/tma-order-summary.component';
import { TmaCartItemComponent } from './cart-item/tma-cart-item.component';
import { TmaCartItemListComponent } from './cart-item-list/tma-cart-item-list.component';
import { EffectsModule } from '@ngrx/effects';
import { TmaTmfCartEffect } from '../../../../core/tmf-cart/store/effects/tma-tmf-cart.effect';
import { TmaItemCounterModule } from '../../../shared/components/item-counter';
import { TmaPurchaseReasonModule } from '../../purchase-reason';
import { LogicalResourceModule } from './logical-resource';
import { JourneyChecklistLogicalResourceComponent } from '../../journey-checklist';
import { CartItemPriceModule } from './cart-item-price';
import { AppointmentComponentModule } from './appointment/appointment.module';
import { TmaPremiseDetailsModule } from '../../premise-details';

@NgModule({
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule,
    CartCouponModule,
    CartItemPriceModule,
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
    LogicalResourceModule,
    AppointmentComponentModule,
    EffectsModule.forFeature([TmaTmfCartEffect])
  ],
  declarations: [
    TmaCartItemComponent,
    TmaCartItemListComponent,
    TmaOrderSummaryComponent
  ],
  entryComponents: [JourneyChecklistLogicalResourceComponent],
  exports: [
    TmaCartItemComponent,
    TmaCartItemListComponent,
    TmaOrderSummaryComponent
  ]
})
export class TmaCartSharedModule extends CartSharedModule {
}
