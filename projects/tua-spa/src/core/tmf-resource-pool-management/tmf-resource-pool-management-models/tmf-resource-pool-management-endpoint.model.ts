export const RESOURCE_POOL_MANAGEMENT_DEFAULT_SCOPE = 'default';

/**
 * Structure for Resource Tmf endpoint
 */
export interface TmfResourcePoolManagementEndpoint {
  baseUrl?: string;
  prefix?: string;
  endpoint?: string | TmfResourcePoolManagementEndpointWithScope;
}

/**
 * Structure for Resource Tmf endpoint with scope
 */
export interface TmfResourcePoolManagementEndpointWithScope {
  default?: string;

  [scope: string]: string;
}

/**
 * Structure for Resource Tmf endpoints
 */
export interface TmfResourcePoolManagementEndpointMap {
  [id: string]: TmfResourcePoolManagementEndpoint;
}
