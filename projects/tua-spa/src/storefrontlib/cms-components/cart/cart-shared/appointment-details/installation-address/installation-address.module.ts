import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { InstallationAddressComponent } from './installation-address.component';

@NgModule({
  declarations: [InstallationAddressComponent],
  imports: [CommonModule, I18nModule],
  exports: [InstallationAddressComponent],
  entryComponents: [],
})
export class InstallationAddressComponentModule {}
