import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  ConfigModule,
  FeaturesConfigModule,
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import { TmaOrderDetailItemsComponent } from './order-detail-items/tma-order-detail-items.component';
import {
  CardModule,
  CmsPageGuard,
  OrderDetailsModule, OrderDetailsService,
  PageLayoutComponent,
  PromotionsModule, SpinnerModule
} from '@spartacus/storefront';
import { TmaOrderDetailTotalsComponent } from './order-detail-totals/tma-order-detail-totals.component';
import { TmaCartSharedModule } from '../../../cart/cart-shared';

@NgModule({
  imports: [
    TmaCartSharedModule,
    CardModule,
    CommonModule,
    I18nModule,
    FeaturesConfigModule,
    PromotionsModule,
    UrlModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'order', cxRoute: 'orderGuest' }
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'orderDetails' }
      }
    ]),
    ConfigModule.withConfig({
      cmsComponents: {
        AccountOrderDetailsItemsComponent: {
          component: TmaOrderDetailItemsComponent
        },
        AccountOrderDetailsTotalsComponent: {
          component: TmaOrderDetailTotalsComponent
        }
      },
      features: {
        consignmentTracking: '1.2',
      }
    }),
    SpinnerModule
  ],
  providers: [OrderDetailsService],
  declarations: [TmaOrderDetailItemsComponent, TmaOrderDetailTotalsComponent],
  exports: [TmaOrderDetailItemsComponent, TmaOrderDetailTotalsComponent],
  entryComponents: [TmaOrderDetailItemsComponent, TmaOrderDetailTotalsComponent]
})
export class TmaOrderDetailsModule extends OrderDetailsModule { }
