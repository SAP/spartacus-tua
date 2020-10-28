import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { TmaUsageChargeComponent } from './usage-charge/tma-usage-charge.component';
import { TmaPerUnitChargeComponent } from './usage-charge/per-unit-charge/tma-per-unit-charge.component';
import { TmaVolumeChargeComponent } from './usage-charge/volume-charge/tma-volume-charge.component';
import { TmaRecurringChargeComponent } from './recurring-charge/tma-recurring-charge.component';
import { TmaOneTimeChargeComponent } from './one-time-charge/tma-one-time-charge.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
  ],
  declarations: [TmaOneTimeChargeComponent, TmaRecurringChargeComponent, TmaUsageChargeComponent, TmaPerUnitChargeComponent, TmaVolumeChargeComponent],
  exports: [TmaOneTimeChargeComponent, TmaRecurringChargeComponent, TmaUsageChargeComponent, TmaPerUnitChargeComponent, TmaVolumeChargeComponent]
})
export class TmaPriceModule { }
