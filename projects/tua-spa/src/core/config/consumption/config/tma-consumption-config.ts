import { TmaConsumptionValue } from '../../../model';

export abstract class TmaConsumptionConfig {
  consumption?: {
    defaultValues: TmaConsumptionValue[],
    default: string,
  };
}
