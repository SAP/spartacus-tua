import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CmsConfig,
  ConfigModule,
  AuthGuard,
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import { SubscriptionBaseListComponent } from './subscriptionbase-list.component';
import { SubscriptionBaseService } from '../../../../../core/subscription/subscriptionbase/facade';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionBaseDetailsService } from '../../../../../core/subscription/subscriptionbase-details/facade';
import { UsageConsumptionComponentModule } from '../usage-consumption';
import { UsageConsumptionService } from '../../../../../core/subscription';
import { RouterModule } from '@angular/router';
import { TmfProductComponentModule } from '../tmf-product';
import { RenewSubscriptionComponentModule } from '../renew-subscription';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    NgbModule,
    UsageConsumptionComponentModule,
    RenewSubscriptionComponentModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        AccountSubscriptionComponent: {
          component: SubscriptionBaseListComponent,
          guards: [AuthGuard],
        },
      },
    }),
    TmfProductComponentModule,
    UrlModule,
    RouterModule,
  ],
  providers: [
    SubscriptionBaseService,
    SubscriptionBaseDetailsService,
    UsageConsumptionService,
  ],
  declarations: [SubscriptionBaseListComponent],
  exports: [SubscriptionBaseListComponent],
  entryComponents: [SubscriptionBaseListComponent],
})
export class SubscriptionBaseListModule {}
