import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { StructuredDataModule } from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { TmaPurchaseReasonComponent } from './tma-purchase-reason.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    StructuredDataModule,
    NgSelectModule,
    ReactiveFormsModule
  ],
  declarations: [TmaPurchaseReasonComponent],
  exports: [TmaPurchaseReasonComponent]
})
export class TmaPurchaseReasonModule {
}
