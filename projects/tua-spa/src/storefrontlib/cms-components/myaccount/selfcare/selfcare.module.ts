import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  ConfigModule,
  I18nModule,
  UrlModule
} from '@spartacus/core';
import {
  GenericLinkModule,
  MediaModule,
  OutletModule,
  SplitViewModule,
  TableHeaderCellComponent,
  TableModule
} from '@spartacus/storefront';
import { TmaCardModule } from '../../shared/tma-card/tma-card.module';
import { TmaActiveLinkCellComponent } from '../../shared/tma-table/tma-active-link/tma-active-link-cell.component';
import { TmaCellComponent } from '../../shared/tma-table/tma-cell.component';
import { TmaCellModule } from '../../shared/tma-table/tma-cell.module';
import { TmaPaymentStatusCellComponent } from '../../shared/tma-table/tma-status/tma-payment-status-cell.component';
import { TmaStatusCellComponent } from '../../shared/tma-table/tma-status/tma-status-cell.component';
import { TmaToggleLinkCellComponent } from '../../shared/tma-table/tma-toggle-link/tma-toggle-link-cell.component';
import { SelfcareBannerComponent } from './selfcare-banner/selfcare-banner.component';
import { SelfcareBillingAccountsComponent } from './selfcare-billing-accounts/selfcare-billing-accounts.component';
import { AccountComponent } from './selfcare-subscriptions/account/account.component';
import { AgreementComponent } from './selfcare-subscriptions/agreement/agreement.component';
import { ChildProductsComponent } from './selfcare-subscriptions/child-products/child-products.component';
import { OrderComponent } from './selfcare-subscriptions/order/order.component';
import { SelfcareSubscriptionsComponent } from './selfcare-subscriptions/selfcare-subscriptions.component';
import { SubscriptionDetailsComponent } from './selfcare-subscriptions/subscription-details/subscription-details.component';

@NgModule({
  imports: [
    CommonModule,
    TmaCardModule,
    TmaCellModule,
    GenericLinkModule,
    I18nModule,
    MediaModule,
    TableModule,
    OutletModule,
    UrlModule,
    RouterModule,
    SplitViewModule,
    ConfigModule.withConfig({
      cmsComponents: {
        BannerComponent: {
          canActivate: [AuthGuard],
          component: SelfcareBannerComponent
        },
        SelfcareSubscriptionsComponent: {
          canActivate: [AuthGuard],
          component: SelfcareSubscriptionsComponent,
          childRoutes: {
            children: [
              {
                path: `:${'name'}`,
                component: SubscriptionDetailsComponent,
                children: [
                  {
                    path: 'account',
                    component: AccountComponent
                  },
                  {
                    path: 'agreement',
                    component: AgreementComponent
                  },
                  {
                    path: 'order',
                    component: OrderComponent
                  },
                  {
                    path: 'childProducts',
                    component: ChildProductsComponent
                  }
                ]
              }
            ]
          }
        },
        BillingAccountsComponent: {
          canActivate: [AuthGuard],
          component: SelfcareBillingAccountsComponent
        }
      }
    })
  ],
  exports: [
    AccountComponent,
    AgreementComponent,
    ChildProductsComponent,
    OrderComponent,
    SelfcareBannerComponent,
    SelfcareBillingAccountsComponent,
    SelfcareSubscriptionsComponent,
    SubscriptionDetailsComponent
  ],
  entryComponents: [
    AccountComponent,
    AgreementComponent,
    ChildProductsComponent,
    OrderComponent,
    SelfcareBannerComponent,
    SelfcareBillingAccountsComponent,
    SelfcareSubscriptionsComponent,
    SubscriptionDetailsComponent,
    TmaActiveLinkCellComponent,
    TmaCellComponent,
    TmaPaymentStatusCellComponent,
    TmaStatusCellComponent,
    TableHeaderCellComponent,
    TmaToggleLinkCellComponent
  ],
  declarations: [
    AccountComponent,
    AgreementComponent,
    ChildProductsComponent,
    OrderComponent,
    SelfcareBannerComponent,
    SelfcareBillingAccountsComponent,
    SelfcareSubscriptionsComponent,
    SubscriptionDetailsComponent
  ]
})
export class SelfcareModule {}
