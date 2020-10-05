import { TmaTmfCartEffect } from './effects/tma-tmf-cart.effect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    EffectsModule.forFeature([TmaTmfCartEffect]),
    RouterModule
  ]
})
export class TmaTmfCartStoreModule { }
