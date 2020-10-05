import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageConsumptionGridComponent } from './usage-consumption-grid/usage-consumption-grid.component';
import { UsageConsumptionPiechartComponent } from './usage-consumption-piechart/usage-consumption-piechart.component';
import {
  ConfigModule,AuthGuard, I18nModule, UrlModule
} from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { CmsPageGuard, PageLayoutComponent } from '@spartacus/storefront';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { UsageConsumptionHeaderComponent } from './usage-consumption-header/usage-consumption-header.component';
@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    I18nModule,
    UrlModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'usageConsumption' },
      },
    ]),
    ConfigModule.withConfig({
      cmsComponents: {
        TmaPageBackComponent: {
          component: UsageConsumptionHeaderComponent,
        },
        SubscriptionUsageGridComponent: {
          component: UsageConsumptionGridComponent,
        },
        AccountUsageConsumptionPieChartComponent: {
          component: UsageConsumptionPiechartComponent,
        }
      }
    })
  ],
  declarations: [UsageConsumptionHeaderComponent, UsageConsumptionPiechartComponent, UsageConsumptionGridComponent],
  exports: [UsageConsumptionHeaderComponent, UsageConsumptionPiechartComponent, UsageConsumptionGridComponent],
  entryComponents: [UsageConsumptionHeaderComponent, UsageConsumptionPiechartComponent, UsageConsumptionGridComponent],
  providers: [ ThemeService ]
})

export class UsageConsumptionComponentModule { }
