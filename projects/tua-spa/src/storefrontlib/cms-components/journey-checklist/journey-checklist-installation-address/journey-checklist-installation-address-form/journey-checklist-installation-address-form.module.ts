import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { JourneyChecklistInstallationAddressFormComponent } from './journey-checklist-installation-address-form.component';
import { TmaAddressFormModule } from '../../../address-form';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    NgbModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    TmaAddressFormModule
  ],
  declarations: [JourneyChecklistInstallationAddressFormComponent],
  exports: [JourneyChecklistInstallationAddressFormComponent],
  entryComponents: [JourneyChecklistInstallationAddressFormComponent]
})
export class JourneyChecklistInstallationAddressFormModule {
}
