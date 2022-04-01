import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionDetailsComponent } from './subscription-details.component';
import { I18nModule, ConfigModule, CmsConfig, AuthGuard, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { TmfProductComponentModule } from '../tmf-product/tmf-product.module';
import { SpinnerModule } from '@spartacus/storefront';
import {RenewSubscriptionBannerModule} from "../renew-subscription-banner";
import { TerminateSubscriptionModule } from './terminate-subscription/terminate-subscription.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    I18nModule,
    RouterModule,
    UrlModule,
    SpinnerModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        AccountSubscriptionDetailsComponent: { 
          canActivate: [AuthGuard],
          component: SubscriptionDetailsComponent
        }
      }
    }),
    TmfProductComponentModule,
    RenewSubscriptionBannerModule,
    TerminateSubscriptionModule
  ],
  providers: [
  ],
  declarations: [SubscriptionDetailsComponent],
  exports: [SubscriptionDetailsComponent],
  entryComponents: [SubscriptionDetailsComponent]
})
export class SubscriptionDetailsModule { }
