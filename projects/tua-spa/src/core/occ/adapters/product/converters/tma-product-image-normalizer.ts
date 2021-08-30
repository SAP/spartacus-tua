import { Injectable } from '@angular/core';
import {
  ProductImageNormalizer,
  Converter,
  Occ,
  Product,
  OccConfig,
} from '@spartacus/core';

@Injectable({ providedIn: 'root' })
export class TmaProductImageNormalizer
  extends ProductImageNormalizer
  implements Converter<Occ.Product, Product> {
  constructor(protected config: OccConfig) {
    super(config);
  }

  convert(source: Occ.Product, target?: Product): Product {
    if (source === undefined) {
      target = {};
      return target;
    }
    if (target === undefined) {
      target = { ...(source as any) };
    }
    if (source && source.images) {
      target.images = this.normalize(source.images);
    }
    return target;
  }
}