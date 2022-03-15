export abstract class TmaProductSpecificationAverageCostConfig {
    productSpecificationAverageCost?: string[];
}

declare module '@spartacus/core' {
  interface Config extends TmaProductSpecificationAverageCostConfig {}
}
  