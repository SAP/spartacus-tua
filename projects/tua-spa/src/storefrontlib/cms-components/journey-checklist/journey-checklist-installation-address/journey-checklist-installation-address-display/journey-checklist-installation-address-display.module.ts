import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { JourneyChecklistInstallationAddressDisplayComponent } from './journey-checklist-installation-address-display.component';
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
  declarations: [JourneyChecklistInstallationAddressDisplayComponent],
  exports: [JourneyChecklistInstallationAddressDisplayComponent],
  entryComponents: [JourneyChecklistInstallationAddressDisplayComponent]
})
export class JourneyChecklistInstallationAddressDisplayModule {
}
