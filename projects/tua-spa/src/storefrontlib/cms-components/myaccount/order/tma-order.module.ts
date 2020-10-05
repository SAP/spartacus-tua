import { NgModule } from '@angular/core';
import {
  OrderCancellationModule,
  OrderHistoryModule,
  OrderModule,
  OrderReturnModule,
  ReturnRequestDetailModule,
  ReturnRequestListModule
} from '@spartacus/storefront';
import { TmaOrderDetailsModule } from './order-details';

@NgModule({
  imports: [
    OrderHistoryModule,
    TmaOrderDetailsModule,
    OrderCancellationModule,
    OrderReturnModule,
    ReturnRequestListModule,
    ReturnRequestDetailModule
  ]
})
export class TmaOrderModule extends OrderModule { }
