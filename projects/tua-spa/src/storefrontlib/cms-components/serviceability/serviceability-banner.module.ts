import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { OutletModule, MediaModule } from '@spartacus/storefront';
import { TmaAddressFormModule } from '../address-form';
import { ProductDetailsDialogModule } from '../product/product-details-dialog/product-details-dialog.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ServiceabilityFormComponent } from './serviceability-form/serviceability-form.component';
import { ServiceabilityBannerComponent } from './serviceability-banner.component';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    MediaModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    TmaAddressFormModule,
    FormsModule,
    ProductDetailsDialogModule,
    ConfigModule.withConfig({
      cmsComponents: {
        TmaServiceabilityBannerComponent: {
          component: ServiceabilityBannerComponent
        }
      }
    })
  ],
  declarations: [ServiceabilityBannerComponent, ServiceabilityFormComponent],
  entryComponents: [ServiceabilityBannerComponent, ServiceabilityFormComponent],
  exports: [ServiceabilityBannerComponent]
})
export class ServiceabilityBannerModule {}
