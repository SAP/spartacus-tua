import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { I18nModule, UrlModule } from '@spartacus/core';
import {
  GenericLinkModule,
  IconModule,
  MediaModule,
  OutletModule
} from '@spartacus/storefront';
import { TmaActiveLinkCellComponent } from './tma-active-link/tma-active-link-cell.component';
import { TmaCellComponent } from './tma-cell.component';
import { TmaPaymentStatusCellComponent } from './tma-status/tma-payment-status-cell.component';
import { TmaStatusCellComponent } from './tma-status/tma-status-cell.component';
import { TmaToggleLinkCellComponent } from './tma-toggle-link/tma-toggle-link-cell.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    IconModule,
    OutletModule,
    GenericLinkModule,
    ReactiveFormsModule,
    NgbModule,
    I18nModule,
    MediaModule,
    I18nModule
  ],
  declarations: [
    TmaActiveLinkCellComponent,
    TmaCellComponent,
    TmaPaymentStatusCellComponent,
    TmaStatusCellComponent,
    TmaToggleLinkCellComponent
  ],
  exports: [
    TmaActiveLinkCellComponent,
    TmaCellComponent,
    TmaPaymentStatusCellComponent,
    TmaStatusCellComponent,
    TmaToggleLinkCellComponent
  ]
})
export class TmaCellModule {}
