import { Injectable } from '@angular/core';
import { TmaConsumptionLoadedConfig } from './tma-consumption-loaded-config';

@Injectable({ providedIn: 'root' })
export class TmaConsumptionLoadedConfigConverter {

  fromConsumptionConfig(consumptionConfig: TmaConsumptionLoadedConfig): TmaConsumptionLoadedConfig {
    return {
      defaultValues: consumptionConfig.defaultValues,
      default: consumptionConfig.default
    };
  }
}
