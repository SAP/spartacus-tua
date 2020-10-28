import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaDiscountDisplayComponent } from './tma-discount-display.component';
import { I18nModule } from '@spartacus/core';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, I18nModule],
  declarations: [TmaDiscountDisplayComponent],
  exports: [TmaDiscountDisplayComponent]
})
export class TmaDiscountDisplayModule {}
