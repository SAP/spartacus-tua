import {TmaAttachment, TmaExternalIdentifier} from './tma-common.model';

export interface TmaServiceSpecificationRef {
  '@baseType'?: string;
  '@referredType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
  externalIdentifier?: TmaExternalIdentifier[];
  href?: string;
  id?: string;
  name?: string;
  targetServiceSchema?: TmaTargetServiceSchema;
  version?: string;
}

export interface TmaTargetServiceSchema {
  '@baseType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
}

export interface TmaRealizingService {
  '@referredType'?: string;
  href?: string;
  id?: string;
  name?: string;
  role?: string;
}

export interface TmaUsageSpecificationRef {
  '@referredType'?: string;
  externalIdentifier?: TmaExternalIdentifier[];
  href?: string;
  id?: string;
  name?: string;
}

export interface TmaVariantOption {
  id?: string;
  variantCategory?: string;
  variantValue?: string;
}

export interface TmaProductOfferingRef {
  '@referredType'?: string;
  '@type'?: string;
  href?: string;
  id?: string;
  image?: TmaAttachment;
  name?: string;
  variantOption?: TmaVariantOption[];
}

export interface TmaProductOfferingPriceRef {
  '@baseType'?: string;
  '@referredType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
  href?: string;
  id?: string;
  name?: string;
}
