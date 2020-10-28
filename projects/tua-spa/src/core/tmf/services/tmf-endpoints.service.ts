import { HttpParams } from '@angular/common/http';
import { Injectable, isDevMode, OnDestroy, Optional } from '@angular/core';
import { TmfConfig } from '../config/tmf-config';
import { BASE_SITE_CONTEXT_ID, BaseSiteService } from '@spartacus/core';
import { TmaDynamicTemplate } from '../../config/utils/tma-dynamic-template';
import { getContextParameterDefault } from '../../site-context/config/tma-context-config-utils';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class TmfEndpointsService implements OnDestroy {

  protected activeBaseSite: string;
  protected readonly SCOPE_SUFFIX = '_scopes';

  protected destroyed$ = new Subject();

  constructor(
    private config: TmfConfig,
    @Optional() private baseSiteService: BaseSiteService
  ) {
    this.activeBaseSite =
      getContextParameterDefault(this.config, BASE_SITE_CONTEXT_ID) || '';

    if (this.baseSiteService) {
      this.baseSiteService.getActive()
        .pipe(takeUntil(this.destroyed$))
        .subscribe(value => (this.activeBaseSite = value));
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns and endpoint starting from the TMF baseUrl (no baseSite)
   * @param endpoint Endpoint suffix
   */
  getRawEndpoint(endpoint: string): string {
    if (!this.config || !this.config.backend || !this.config.backend.tmf) {
      return '';
    }
    endpoint = this.config.backend.tmf.endpoints[endpoint];

    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }

    return this.config.backend.tmf.baseUrl + endpoint;
  }

  /**
   * Returns base TMF endpoint (baseUrl + prefix + baseSite)
   */
  getBaseEndpoint(): string {
    if (!this.config || !this.config.backend || !this.config.backend.tmf) {
      return '';
    }

    return (
      (this.config.backend.tmf.baseUrl || '') +
      this.config.backend.tmf.prefix
    );
  }

  /**
   * Returns an TMF endpoint including baseUrl and baseSite
   * @param endpoint Endpoint suffix
   */
  getEndpoint(endpoint: string): string {
    return this.getBaseEndpoint() + endpoint;
  }

  /**
   * Returns a fully qualified TMF Url (including baseUrl and baseSite)
   * @param endpoint Name of the TMF endpoint key config
   * @param urlParams  URL parameters
   * @param queryParams Query parameters
   * @param scope The scope of the url
   */
  getUrl(
    endpoint: string,
    urlParams?: object[],
    queryParams?: object[],
    scope = ''
  ): string {
    endpoint = this.getEndpointForScope(endpoint, scope);

    if (urlParams) {
      urlParams.forEach((urlParam: object) => {
        Object.keys(urlParam).forEach((key: string) =>
          urlParam[key] = encodeURIComponent(urlParam[key])
        );
        endpoint = TmaDynamicTemplate.resolve(endpoint, urlParam);
      });
    }

    if (queryParams) {
      let httpParamsOptions;

      if (endpoint.includes('?')) {
        let queryParamsFromEndpoint;
        [endpoint, queryParamsFromEndpoint] = endpoint.split('?');

        httpParamsOptions = { fromString: queryParamsFromEndpoint };
      }

      let httpParams = new HttpParams(httpParamsOptions);
      Object.keys(queryParams).forEach(key => {
        const value = queryParams[key];
        if (value !== undefined) {
          if (value === null) {
            httpParams = httpParams.delete(key);
          } else {
            httpParams = httpParams.set(key, value);
          }
        }
      });

      const params = httpParams.toString();
      if (params.length) {
        endpoint += '?' + params;
      }
    }

    return this.getEndpoint(endpoint);
  }

  private getEndpointForScope(endpoint: string, scope: string): string {
    const endpointsConfig =
      this.config.backend &&
      this.config.backend.tmf &&
      this.config.backend.tmf.endpoints;

    if (scope) {
      const endpointConfig = endpointsConfig[`${endpoint}${this.SCOPE_SUFFIX}`];
      if (endpointConfig && endpointConfig[scope]) {
        return endpointConfig[scope];
      }
      if (isDevMode()) {
        console.warn(
          `${endpoint} endpoint configuration missing for scope "${scope}"`
        );
      }
    }

    return endpointsConfig[endpoint] || endpoint;
  }
}
