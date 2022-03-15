import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentMethodModule } from "@spartacus/checkout/components";
import { I18nModule } from '@spartacus/core';
import {
  CardModule,
  FormErrorsModule,
  IconModule,
  SpinnerModule
} from '@spartacus/storefront';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TmaCartSharedModule } from '../../../../cart';
import { TmaPriceDisplayModule } from '../../../../product/price/price-display/tma-price-display.module';
import { TerminationButtonComponent } from './termination-button/termination-button.component';
import { TerminationConfirmComponent } from './termination-confirm/termination-confirm.component';

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
export class TerminateSubscriptionModule { }
