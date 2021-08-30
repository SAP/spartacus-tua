import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { QUERY_SERVICE_QUALIFICATION_FEATURE } from './query-service-qualification-state';
import { reducerToken, reducerProvider, metaReducers } from './reducers/index';
import { QueryServiceQualificationEffects } from './effects';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(QUERY_SERVICE_QUALIFICATION_FEATURE, reducerToken, {
      metaReducers
    }),
    EffectsModule.forFeature([QueryServiceQualificationEffects]),
    RouterModule
  ],
  providers: [reducerProvider]
})
export class QueryServiceQualificationStoreModule {}