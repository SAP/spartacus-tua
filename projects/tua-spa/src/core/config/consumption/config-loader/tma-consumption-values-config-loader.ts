import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { TmaConsumptionConfig } from '../config';

@Injectable({ providedIn: 'root' })
export class TmaConsumptionValuesConfigLoader {
  constructor(
    protected config: TmaConsumptionConfig
  ) {
  }

  private get defaultValues(): any[] {
    return this.config.consumption.defaultValues;
  }

  private get default(): string {
    return this.config.consumption.default;
  }

  load() {
    if (!this.config || !this.config.consumption || !this.config.consumption.defaultValues || !this.config.consumption.default) {
      return throwError(new Error(`Missing config for consumption!`));
    }
  }
}
