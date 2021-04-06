import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { UsageConsumptionReport } from '../../../model';

export const USAGE_CONSUMPTION_NORMALIZER = new InjectionToken<
  Converter<any, UsageConsumptionReport>
>('TmaUsageConsumptionNormalizer');
