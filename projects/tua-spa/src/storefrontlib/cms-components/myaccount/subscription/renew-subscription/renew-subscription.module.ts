import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { RenewSubscriptionComponent } from './renew-subscription.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [CommonModule, I18nModule, NgxSpinnerModule],
  providers: [],
  declarations: [RenewSubscriptionComponent],
  exports: [RenewSubscriptionComponent],
  entryComponents: [RenewSubscriptionComponent]
})
export class RenewSubscriptionComponentModule {}
