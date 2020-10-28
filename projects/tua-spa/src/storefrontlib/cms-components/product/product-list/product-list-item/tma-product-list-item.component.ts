import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductListItemComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-list-item',
  templateUrl: './tma-product-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductListItemComponent extends ProductListItemComponent {
}
