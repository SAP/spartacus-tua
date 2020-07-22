import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { ProductViewComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-view',
  templateUrl: './tma-product-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductViewComponent extends ProductViewComponent {
}
