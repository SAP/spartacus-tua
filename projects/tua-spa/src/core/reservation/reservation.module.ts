import { NgModule, ModuleWithProviders } from '@angular/core';
import { MsisdnReservationService } from './facade';
import { LogicalResourceReservationService } from './facade';
import { ReservationStoreModule } from './store/reservation-store.module';

@NgModule({
  imports: [ReservationStoreModule]
})
export class ReservationModule {
  static forRoot(): ModuleWithProviders<ReservationModule> {
    return {
      ngModule: ReservationModule,
      providers: [LogicalResourceReservationService, MsisdnReservationService]
    };
  }
}
