import { Injectable } from '@angular/core';
import { TmaProductSpecificationForViewDetailsConfig } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class TmaProductService {

  constructor(
    protected productSpecificationViewDetailsConfig: TmaProductSpecificationForViewDetailsConfig
  ) {
  }

  isProductSpecificationForViewDetails(productSpecification: string): boolean {
    return productSpecification &&
      !!this.productSpecificationViewDetailsConfig.productSpecificationForViewDetails.find((pSpec: string) => pSpec === productSpecification);
  }
}
