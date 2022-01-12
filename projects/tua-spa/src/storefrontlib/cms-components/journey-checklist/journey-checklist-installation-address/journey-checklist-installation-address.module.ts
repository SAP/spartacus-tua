import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneyChecklistInstallationAddressDisplayModule } from './journey-checklist-installation-address-display';
import { JourneyChecklistInstallationAddressFormModule } from './journey-checklist-installation-address-form';

@NgModule({
  imports: [
    CommonModule,
    JourneyChecklistInstallationAddressFormModule,
    JourneyChecklistInstallationAddressDisplayModule
  ],
  providers: [],
  declarations: [],
  entryComponents: [],
  exports: []
})
export class JourneyChecklistInstallationAddressModule {
}
