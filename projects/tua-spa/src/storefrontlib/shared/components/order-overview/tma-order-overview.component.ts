import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslationService } from '@spartacus/core';
import { OrderOverviewComponent } from '@spartacus/storefront';
import { TmaOrder, TmaOrderEntry } from '../../../../core';

@Component({
  selector: 'cx-order-overview',
  templateUrl: './tma-order-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaOrderOverviewComponent extends OrderOverviewComponent {
  constructor(protected translation: TranslationService) {
    super(translation);
  }

  /**
   * Checks for product present inside the entries of an order.
   *
   * @param order as an {@link Order}
   *
   * @return true if there is entry having product otherwise false {@link boolean}
   */
  checkOrderFor(order: TmaOrder): boolean {
    let entry: TmaOrderEntry;
    if (order.entries) {
      entry = order.entries.find(
        (item: TmaOrderEntry) => Object.keys(item.product).length === 0
      );
    }
    return entry === undefined ? true : false;
  }
}
