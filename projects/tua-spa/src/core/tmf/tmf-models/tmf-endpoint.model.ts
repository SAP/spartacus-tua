export const TMF_DEFAULT_SCOPE = 'default';

/**
 * Structure for Tmf endpoints
 */
export interface TmfEndpoint {
  baseUrl?: string;
  prefix?: string;
  version?:string
  endpoint?: string | TmfEndpointWithScope;
}

/**
 * Structure for Tmf endpoint with scope
 */
export interface TmfEndpointWithScope {
  default?: string;
  [scope: string]: string;
}

/**
 * Structure for Tmf endpoints
 */
export interface TmfEndpointMap {
  [id: string]: TmfEndpoint;
}
