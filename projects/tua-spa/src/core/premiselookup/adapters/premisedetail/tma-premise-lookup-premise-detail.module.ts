import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigModule } from '@spartacus/core';
import { TmaPremiseDetailAdapter, TMA_TECHNICAL_RESOURCE_NORMALIZER } from '../../../premisedetail';
import { TmaPremiseLookupPremiseDetailNormalizer } from './converter';
import { defaultTmaPremiseLookupPremiseDetailConfig } from './default-tma-premise-lookup-premise-detail-config';
import { TmaPremiseLookupPremiseDetailAdapter } from './tma-premise-lookup-premise-detail.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmaPremiseLookupPremiseDetailConfig)
  ],
  providers: [
    {
      provide: TmaPremiseDetailAdapter,
      useClass: TmaPremiseLookupPremiseDetailAdapter
    },
    {
      provide: TMA_TECHNICAL_RESOURCE_NORMALIZER,
      useExisting: TmaPremiseLookupPremiseDetailNormalizer,
      multi: true
    }
  ]
})
export class TmaPremiseLookupPremiseDetailModule { }
