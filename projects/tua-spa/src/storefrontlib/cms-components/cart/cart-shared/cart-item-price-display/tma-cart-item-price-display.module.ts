import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaCartItemPriceDisplayComponent } from './tma-cart-item-price-display.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [TmaCartItemPriceDisplayComponent],
  exports: [TmaCartItemPriceDisplayComponent]
})
export class TmaCartItemPriceDisplayModule {}
