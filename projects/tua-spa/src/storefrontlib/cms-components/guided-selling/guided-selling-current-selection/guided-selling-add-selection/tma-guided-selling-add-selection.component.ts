import { Input, Component, Output, EventEmitter } from '@angular/core';
import { TmaProduct } from '../../../../../core/model';

@Component({
  selector: 'cx-guided-selling-add-selection',
  templateUrl: './tma-guided-selling-add-selection.component.html'
})

export class TmaGuidedSellingAddSelectionComponent {

  @Input()
  product: TmaProduct;

  @Input()
  isSelected: boolean;

  @Output()
  updateSelected = new EventEmitter<boolean>();

  /**
   * Selects a product.
   */
  selectProduct(): void {
    this.updateSelected.emit(!this.isSelected);
  }
}
