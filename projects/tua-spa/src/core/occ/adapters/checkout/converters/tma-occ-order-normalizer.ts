import { Injectable } from '@angular/core';
import {
  OccOrderNormalizer,
  Converter,
  Occ,
  Order,
  ConverterService,
  OrderEntry
} from '@spartacus/core';
import { TMA_PRODUCT_NORMALIZER } from '../../../../../core/product/connectors';

@Injectable({ providedIn: 'root' })
export class TmaOccOrderNormalizer
  extends OccOrderNormalizer
  implements Converter<Occ.Order, Order> {
  constructor(private tmaConverter: ConverterService) {
    super(tmaConverter);
  }

  convert(source: Occ.Order, target?: Order): Order {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    if (source.entries) {
      target.entries = source.entries.map((entry) =>
        this.tmaConvertOrderEntry(entry)
      );
    }

    if (source.consignments) {
      target.consignments = source.consignments.map((consignment) => ({
        ...consignment,
        entries: consignment.entries.map((entry) => ({
          ...entry,
          orderEntry: this.tmaConvertOrderEntry(entry.orderEntry)
        }))
      }));
    }

    if (source.unconsignedEntries) {
      target.unconsignedEntries = source.unconsignedEntries.map((entry) =>
        this.tmaConvertOrderEntry(entry)
      );
    }

    return target;
  }

  protected tmaConvertOrderEntry(source: Occ.OrderEntry): OrderEntry {
    return {
      ...source,
      product: this.tmaConverter.convert(source.product, TMA_PRODUCT_NORMALIZER)
    };
  }
}