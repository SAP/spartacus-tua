import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { TmaConsumptionDialogComponent } from './consumption-component/dialog/tma-consumption-dialog.component';
import { TmaConsumptionComponent } from './consumption-component/tma-consumption.component';
import { TmaPoSearchByConsumptionComponent } from './po-search-by-consumption-component/tma-po-search-by-consumption.component';
import { TmaSliderOptionComponent } from './slider-option-component/tma-slider-option.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    RouterModule,
    UrlModule,
    I18nModule,
    NgbModule,
    ReactiveFormsModule,
    IconModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ConsumptionListComponent: {
          component: TmaConsumptionComponent
        }
      }
    })
  ],
  declarations: [
    TmaConsumptionComponent,
    TmaConsumptionDialogComponent,
    TmaPoSearchByConsumptionComponent,
    TmaSliderOptionComponent
  ],
  exports: [
    TmaConsumptionComponent,
    TmaConsumptionDialogComponent,
    TmaPoSearchByConsumptionComponent,
    TmaSliderOptionComponent
  ],
  entryComponents: [TmaConsumptionComponent, TmaConsumptionDialogComponent]
})
export class TmaConsumptionModule {
}
