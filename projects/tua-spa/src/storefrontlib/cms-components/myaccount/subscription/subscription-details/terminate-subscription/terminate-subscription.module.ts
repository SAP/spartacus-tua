import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminationButtonComponent } from './termination-button/termination-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  CardModule,
  FormErrorsModule,
  IconModule,
  PaymentMethodModule,
  SpinnerModule
} from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';
import { TmaPriceDisplayModule } from '../../../../product/price/price-display/tma-price-display.module';
import { TmaCartSharedModule } from '../../../../cart';
import { TerminationConfirmComponent } from './termination-confirm/termination-confirm.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    TerminationButtonComponent,
    TerminationConfirmComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    I18nModule,
    SpinnerModule,
    NgxSpinnerModule,
    PaymentMethodModule,
    CardModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormErrorsModule,
    IconModule,
    TmaPriceDisplayModule,
    TmaCartSharedModule
  ],
  exports: [TerminationButtonComponent],
  entryComponents: [TerminationConfirmComponent]
})
export class TerminateSubscriptionModule {}
