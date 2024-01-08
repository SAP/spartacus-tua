import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { GeographicAddressEffects } from './effects';
import { GEOGRAPHIC_ADDRESS_FEATURE } from './geographic-address-state';
import { reducerToken, reducerProvider } from './reducers/index';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(GEOGRAPHIC_ADDRESS_FEATURE, reducerToken, {}),
    EffectsModule.forFeature([GeographicAddressEffects]),
    RouterModule,
  ],
  providers: [reducerProvider],
})
export class GeographicAddressStoreModule {}
