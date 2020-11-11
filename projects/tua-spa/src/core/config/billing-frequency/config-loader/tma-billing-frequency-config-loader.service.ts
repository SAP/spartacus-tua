import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Config, EXTERNAL_CONFIG_TRANSFER_ID, SERVER_REQUEST_URL } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { tmaDeepMerge } from '../../utils/tma-deep-merge';
import { TmaBillingFrequencyLoadedConfig } from './tma-billing-frequency-loaded-config';
import { TmaBillingFrequencyLoadedConfigConverter } from './tma-billing-frequency-loaded-config-converter';
import { TmaBillingFrequencyValuesConfigLoader } from './tma-billing-frequency-values-config-loader';

@Injectable({ providedIn: 'root' })
export class TmaBillingFrequencyConfigLoaderService {

  constructor(
    @Inject(PLATFORM_ID) protected platform: any,
    @Inject(DOCUMENT) protected document: any,
    @Inject(Config) protected config: any,
    protected billingFrequencyValuesConfigLoader: TmaBillingFrequencyValuesConfigLoader,
    protected converter: TmaBillingFrequencyLoadedConfigConverter,
    @Optional() protected transferState: TransferState,
    @Optional()
    @Inject(SERVER_REQUEST_URL)
    protected serverRequestUrl?: string
  ) {
  }

  loadConfig(): Promise<TmaBillingFrequencyLoadedConfig> {
    return this.get()
      .pipe(
        tap(externalConfig => this.transfer(externalConfig)),
        map(externalConfig =>
          tmaDeepMerge({}, ...this.getConfigChunks(externalConfig))
        )
      ).toPromise();
  }

  /**
   * Returns the external config
   */
  protected get(): Observable<TmaBillingFrequencyLoadedConfig> {
    const rehydratedExternalConfig = this.rehydrate();

    return rehydratedExternalConfig
      ? of(rehydratedExternalConfig)
      : this.load();
  }

  /**
   * Tries to rehydrate external config in the browser from SSR
   */
  protected rehydrate(): TmaBillingFrequencyLoadedConfig {
    if (this.transferState && isPlatformBrowser(this.platform)) {
      return this.transferState.get(EXTERNAL_CONFIG_TRANSFER_ID, undefined);
    }
  }

  /**
   * Loads the external config from backend
   */
  protected load(): Observable<TmaBillingFrequencyLoadedConfig> {
    return this.billingFrequencyValuesConfigLoader
      .load()
      .pipe(
        map(billingFrequencyConfig =>
          this.converter.fromBillingFrequencyConfig(billingFrequencyConfig)
        )
      );
  }

  /**
   * Transfers the given external config in SSR to the browser
   *
   * @param externalConfig
   */
  protected transfer(externalConfig: TmaBillingFrequencyLoadedConfig) {
    if (
      this.transferState &&
      isPlatformServer(this.platform) &&
      externalConfig
    ) {
      this.transferState.set(EXTERNAL_CONFIG_TRANSFER_ID, externalConfig);
    }
  }

  protected getConfigChunks(
    externalConfig: TmaBillingFrequencyLoadedConfig
  ): (TmaBillingFrequencyLoadedConfig)[] {
    const chunks: any[] = [this.converter.fromBillingFrequencyConfig(externalConfig)];
    return chunks;
  }
}
