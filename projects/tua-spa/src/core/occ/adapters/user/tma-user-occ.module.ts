import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TmaOccUserOrderAdapter } from './tma-occ-user-order.adapter';
import { UserOccModule, UserOrderAdapter } from '@spartacus/core';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [{ provide: UserOrderAdapter, useClass: TmaOccUserOrderAdapter }],
})
export class TmaUserOccModule extends UserOccModule {}
