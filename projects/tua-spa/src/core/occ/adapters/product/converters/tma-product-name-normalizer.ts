import { Injectable } from '@angular/core';
import {
  ProductNameNormalizer,
  Converter,
  Occ,
  Product,
  OccConfig
} from '@spartacus/core';

@Injectable({ providedIn: 'root' })
export class TmaProductNameNormalizer
  extends ProductNameNormalizer
  implements Converter<Occ.Product, Product> {
  constructor(protected config: OccConfig) {
    super(config);
  }

  convert(source: Occ.Product, target?: Product): Product {
    if (target === undefined) {
      target = { ...(source as any) };
    }
    if (source && source.name) {
      target.name = this.normalize(source.name);
      target.nameHtml = source.name;
    }
    return target;
  }
}
