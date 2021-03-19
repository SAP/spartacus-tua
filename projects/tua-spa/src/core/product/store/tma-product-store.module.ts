import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { TmaProductsSearchEffects } from './effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([TmaProductsSearchEffects]),
  ],
})
export class TmaProductStoreModule {}
