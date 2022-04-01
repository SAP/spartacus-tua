import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StateModule } from '@spartacus/core';
import { TmaCheckoutEffects } from './effects/tma-checkout.effect';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    EffectsModule.forFeature([TmaCheckoutEffects]),
    RouterModule
  ]
})
export class TmaCheckoutStoreModule {}
