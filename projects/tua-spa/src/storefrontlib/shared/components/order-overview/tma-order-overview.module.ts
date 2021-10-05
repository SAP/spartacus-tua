import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { CardModule, OrderOverviewModule } from '@spartacus/storefront';
import { TmaOrderOverviewComponent } from './tma-order-overview.component';

@NgModule({
  imports: [CommonModule, I18nModule, CardModule],
  declarations: [TmaOrderOverviewComponent],
  exports: [TmaOrderOverviewComponent]
})
export class TmaOrderOverviewModule extends OrderOverviewModule {}
