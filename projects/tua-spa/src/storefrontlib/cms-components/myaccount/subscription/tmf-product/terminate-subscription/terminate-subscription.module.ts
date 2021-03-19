import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminationButtonComponent } from './termination-button/termination-button.component';
import { FormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  SpinnerModule
} from '@spartacus/storefront';
import { TmaCartSharedModule } from '../../../../cart';

@NgModule({
  declarations: [
    TerminationButtonComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    I18nModule,
    SpinnerModule,
    TmaCartSharedModule
  ],
  exports: [TerminationButtonComponent],
  entryComponents: []
})
export class TerminateSubscriptionModule {}
