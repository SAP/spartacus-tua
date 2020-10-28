import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaPriceDisplayComponent } from './tma-price-display.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [TmaPriceDisplayComponent],
  exports: [TmaPriceDisplayComponent]
})
export class TmaPriceDisplayModule {}
