import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { I18nModule } from '@spartacus/core';
import { IconModule, StructuredDataModule } from '@spartacus/storefront';
import { TmaAddressFormComponent } from './tma-address-form.component';

@NgModule({
    imports: [
      CommonModule,
      I18nModule,
      StructuredDataModule,
      NgSelectModule,
      ReactiveFormsModule,
      IconModule
    ],
    declarations: [TmaAddressFormComponent],
    exports: [TmaAddressFormComponent],
    entryComponents: [TmaAddressFormComponent]
  })
  export class TmaAddressFormModule {
  }