import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TmaProduct, TmfProduct} from '../../../../../core/model';

@Component({
  selector: 'cx-guided-selling-add-selection',
  templateUrl: './tma-guided-selling-add-selection.component.html'
})

export class TmaGuidedSellingAddSelectionComponent implements OnInit {

  @Input()
  product: TmaProduct;

  @Input()
  isSelected: boolean;

  @Input()
  tmfProducts: TmfProduct[];

  @Output()
  updateSelected = new EventEmitter<boolean>();
  
  isFromSubscription = false;


  ngOnInit() {
    if (this.tmfProducts) {
      this.isFromSubscription = !!this.tmfProducts.some((tmfProduct: TmfProduct) => tmfProduct.productOffering.id === this.product.code);
    }
  }

  /**
   * Selects a product.
   */
  selectProduct(): void {
    this.updateSelected.emit(!this.isSelected);
  }
}
