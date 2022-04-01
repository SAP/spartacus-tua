export interface TmaConsumptionLoadedConfig {
    /**
     * Default value map for product specification and consumption
     */
    defaultValues?: any[],
  
    /**
     * Default value which is used if no value found for product specification and consumption
     */
    default?: string,
}

declare module '@spartacus/core' {
  interface Config extends TmaConsumptionLoadedConfig {}
}
  