import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService, ProductService } from '@spartacus/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TmaBillingFrequencyConfig } from '../../../../../core/config/billing-frequency/config';
import { TmaConsumptionConfig } from '../../../../../core/config/consumption/config';
import { TmaGuidedSellingCurrentSelectionsService } from '../../../../../core/guided-selling/facade';
import { TmaProduct, TmaSelectionAction } from '../../../../../core/model';
import {
  TmaConsumptionChangeService,
  TmaPriceService,
  TmaProductService
} from '../../../../../core';
import { TmaProductListItemComponent } from '../../../product/product-list';

@Component({
  selector: 'cx-guided-selling-product-list-item',
  templateUrl: './tma-guided-selling-product-list-item.component.html',
  styleUrls: ['./tma-guided-selling-product-list-item.component.scss']
})
export class TmaGuidedSellingProductListItemComponent extends TmaProductListItemComponent implements OnInit, OnDestroy {

  isSelected: boolean;

  protected destroyed$ = new Subject();

  constructor(
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected changeDetectorRef: ChangeDetectorRef,
    public priceService: TmaPriceService,
    protected productService: ProductService,
    protected currencyService: CurrencyService,
    protected consumptionConfig: TmaConsumptionConfig,
    protected productSpecificationProductService: TmaProductService,
    protected consumptionChangeService: TmaConsumptionChangeService,
    protected billingFrequencyConfig: TmaBillingFrequencyConfig
  ) {
    super(priceService, productService, currencyService, consumptionConfig, productSpecificationProductService, consumptionChangeService, billingFrequencyConfig);
  }

  ngOnInit(): void {
    this.isSelected = !!this.guidedSellingCurrentSelectionsService.getCurrentSelections()
      .find((currentSelection: TmaProduct) => currentSelection.code === this.product.code);
    this.guidedSellingCurrentSelectionsService.selection$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((selection: { product: TmaProduct, action: TmaSelectionAction }) => {
        this.isSelected = !(selection.action === TmaSelectionAction.REMOVE && this.product.code === selection.product.code) && this.isSelected;
      });
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Updates the currently selected item.
   *
   * @param isSelected - Flag indicating if the current product is selected
   */
  updateSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
    this.guidedSellingCurrentSelectionsService.changeSelection(this.product, this.isSelected ? TmaSelectionAction.ADD :
      TmaSelectionAction.REMOVE);
  }

  /**
   * Sets shouldRemoveCurrentSelections attribute.
   *
   * @param shouldRemoveCurrentSelections - Flag which indicates if current selections should be removed or not.
   */
  setShouldRemoveCurrentSelections(shouldRemoveCurrentSelections: boolean): void {
    this.guidedSellingCurrentSelectionsService.shouldRemoveCurrentSelections = shouldRemoveCurrentSelections;
  }
}
