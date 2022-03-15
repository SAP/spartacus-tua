export abstract class TmaProductSpecificationForViewDetailsConfig {
  productSpecificationForViewDetails?: string[];
}

declare module '@spartacus/core' {
  interface Config extends TmaProductSpecificationForViewDetailsConfig {}
}