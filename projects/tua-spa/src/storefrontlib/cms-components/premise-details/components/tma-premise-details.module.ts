import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { IconModule, SpinnerModule, StructuredDataModule } from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { TmaPremiseDetailsFormComponent } from './premise-details-form/tma-premise-details-form.component';
import { TmaPremiseDetailsComponent } from './tma-premise-details.component';
import { TmaPremiseDetailsDisplayComponent } from './premise-details-display/tma-premise-details-display.component';
import { TmaPurchaseReasonModule } from '../../purchase-reason';
import { TmaAddressFormModule } from '../../address-form';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    StructuredDataModule,
    NgSelectModule,
    ReactiveFormsModule,
    TmaPurchaseReasonModule,
    IconModule,
    SpinnerModule,
    TmaAddressFormModule
  ],
  declarations: [TmaPremiseDetailsComponent, TmaPremiseDetailsFormComponent, TmaPremiseDetailsDisplayComponent],
  exports: [TmaPremiseDetailsComponent, TmaPremiseDetailsFormComponent, TmaPremiseDetailsDisplayComponent],
  entryComponents: [TmaPremiseDetailsFormComponent]
})
export class TmaPremiseDetailsModule {
}
