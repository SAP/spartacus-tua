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
  OrderDetailShippingComponent,
  OrderDetailsModule, OrderDetailsService,
  PageLayoutComponent,
  PromotionsModule, SpinnerModule
} from '@spartacus/storefront';
import { TmaOrderDetailTotalsComponent } from './order-detail-totals/tma-order-detail-totals.component';
import { TmaCartSharedModule } from '../../../cart/cart-shared';
import { TmaOrderDetailShippingComponent } from './order-detail-shipping/tma-order-detail-shipping.component';
import { TmaOrderOverviewModule } from '../../../../shared/components';

@NgModule({
  imports: [
    TmaCartSharedModule,
    CardModule,
    CommonModule,
    I18nModule,
    FeaturesConfigModule,
    PromotionsModule,
    UrlModule,
    TmaOrderOverviewModule,
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
        },
        AccountOrderDetailsShippingComponent: {
          component: TmaOrderDetailShippingComponent
        },
      },
      features: {
        consignmentTracking: '1.2',
      }
    }),
    SpinnerModule
  ],
  providers: [OrderDetailsService],
  declarations: [TmaOrderDetailItemsComponent, TmaOrderDetailTotalsComponent,TmaOrderDetailShippingComponent],
  exports: [TmaOrderDetailItemsComponent, TmaOrderDetailTotalsComponent,TmaOrderDetailShippingComponent],
  entryComponents: [TmaOrderDetailItemsComponent, TmaOrderDetailTotalsComponent,TmaOrderDetailShippingComponent]
})
export class TmaOrderDetailsModule extends OrderDetailsModule { }
