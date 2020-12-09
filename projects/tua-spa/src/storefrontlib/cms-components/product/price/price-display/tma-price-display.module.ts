import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaPriceDisplayComponent } from './tma-price-display.component';
import { I18nModule } from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TmaPriceModule } from '../tma-price.module';
import { TmaAlterationDetailsModule } from '../alterations-details/tma-alteration-details.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule,I18nModule, NgbModule, TmaPriceModule, TmaAlterationDetailsModule],
  declarations: [TmaPriceDisplayComponent],
  exports: [TmaPriceDisplayComponent]
})
export class TmaPriceDisplayModule {}
