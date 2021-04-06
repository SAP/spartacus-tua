import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { defaultTmfRecommendationConfig } from './default-tmf-recommendation-config';
import { TmfRecommendationAdapter } from './tmf-recommendation.adapter';
import { TmfRecommendationNormalizer } from './converters';
import { RecommendationAdapter, RECOMMENDATION_NORMALIZER } from '../../../recommendation';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfRecommendationConfig)
  ],
  providers: [
    {
      provide: RecommendationAdapter,
      useClass: TmfRecommendationAdapter
    },
    {
      provide: RECOMMENDATION_NORMALIZER,
      useExisting: TmfRecommendationNormalizer,
      multi: true
    }
  ]
})
export class TmfRecommendationModule { }
