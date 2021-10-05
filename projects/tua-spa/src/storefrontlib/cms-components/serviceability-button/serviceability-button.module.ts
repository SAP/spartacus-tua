import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { OutletModule, MediaModule } from '@spartacus/storefront';
import { TmaAddressFormModule } from '../address-form';
import { ProductDetailsDialogModule } from '../product/product-details-dialog/product-details-dialog.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ServiceabilityButtonComponent } from './serviceability-button.component';
import { ServiceabilityBannerModule } from '../serviceability';
import { ServiceabilityCategoryFormComponent } from './serviceability-category-form/serviceability-category-form.component';

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
    ServiceabilityBannerModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ServiceabilityButtonComponent: {
          component: ServiceabilityButtonComponent
        }
      }
    })
  ],
  declarations: [
    ServiceabilityButtonComponent,
    ServiceabilityCategoryFormComponent
  ],
  entryComponents: [
    ServiceabilityButtonComponent,
    ServiceabilityCategoryFormComponent
  ],
  exports: [ServiceabilityButtonComponent]
})
export class ServiceabilityButtonModule {}
