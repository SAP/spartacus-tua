import { ModuleWithProviders, NgModule } from '@angular/core';
import { SubscriptionBaseDetailStoreModule } from './store/subscription-base-detail.store.module';
import { SubscriptionBaseDetailService } from './facade';

@NgModule({
  imports: [SubscriptionBaseDetailStoreModule],
})
export class SubscriptionBaseDetailModule {
  static forRoot(): ModuleWithProviders<SubscriptionBaseDetailModule> {
    return {
      ngModule: SubscriptionBaseDetailModule,
      providers: [SubscriptionBaseDetailService],
    };
  }
}
