import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { TmaPriceDisplayModule } from '../price/price-display/tma-price-display.module';
import { MediaModule } from '@spartacus/storefront';
import { TmaAddToCartModule } from '../../cart';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductDetailsDialogComponent } from './product-details-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    TmaPriceDisplayModule,
    MediaModule,
    NgxSpinnerModule,
    TmaAddToCartModule
  ],
  declarations: [ProductDetailsDialogComponent],
  entryComponents: [ProductDetailsDialogComponent],
  exports: [ProductDetailsDialogComponent]
})
export class ProductDetailsDialogModule {}
