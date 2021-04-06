import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenewSubscriptionBannerComponent } from './renew-subscription-banner.component';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import { RenewSubscriptionComponentModule } from '../renew-subscription';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SubscriptionTermModule } from '../../../../../core/subscription-term/store/subscription-term.module';
import { TmaPriceDisplayModule } from '../../../product/price/price-display/tma-price-display.module';
@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    UrlModule,
    RenewSubscriptionComponentModule,
    RouterModule,
    FormsModule,
    SubscriptionTermModule,
    TmaPriceDisplayModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        TmaRenewSubscriptionBannerComponent: {
          component: RenewSubscriptionBannerComponent,
          guards: [AuthGuard]
        },
      },
    }),
  ],
  providers: [],
  declarations: [RenewSubscriptionBannerComponent],
  exports: [RenewSubscriptionBannerComponent],
  entryComponents: [RenewSubscriptionBannerComponent]
})
export class RenewSubscriptionBannerModule {}
