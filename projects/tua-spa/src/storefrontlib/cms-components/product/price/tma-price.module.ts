import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { TmaUsageChargeComponent } from './usage-charge/tma-usage-charge.component';
import { TmaPerUnitChargeComponent } from './usage-charge/per-unit-charge/tma-per-unit-charge.component';
import { TmaRecurringChargeComponent } from './recurring-charge/tma-recurring-charge.component';
import { TmaOneTimeChargeComponent } from './one-time-charge/tma-one-time-charge.component';
import { TmaDiscountDisplayModule } from '../../../shared/components/discount-display';
import { TmaPriceDisplayModule } from './price-display/tma-price-display.module';
import { TmaAlterationDetailsModule } from './alterations-details/tma-alteration-details.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    TmaPriceDisplayModule,
    TmaDiscountDisplayModule,
    TmaAlterationDetailsModule
  ],
  declarations: [TmaOneTimeChargeComponent, TmaRecurringChargeComponent, TmaUsageChargeComponent, TmaPerUnitChargeComponent],
  exports: [TmaOneTimeChargeComponent, TmaRecurringChargeComponent, TmaUsageChargeComponent, TmaPerUnitChargeComponent]
})
export class TmaPriceModule { }
