import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CurrencyService, ProductService } from '@spartacus/core';
import { ProductGridItemComponent } from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  TmaBillingFrequencyConfig, 
  TmaBillingFrequencyMap, 
  TmaConsumptionChangeService, 
  TmaConsumptionConfig, 
  TmaPriceService,
  TmaProductService
} from '../../../../../core';
import { SEPARATOR, TmaCmsConsumptionComponent, TmaConsumptionValue, TmaProduct, TmaUsageUnit } from '../../../../../core/model';

@Component({
  selector: 'cx-product-grid-item',
  templateUrl: './tma-product-grid-item.component.html',
  styleUrls: ['./tma-product-grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaProductGridItemComponent extends ProductGridItemComponent implements OnInit, OnDestroy {

  @Input()
  consumptionComponent: TmaCmsConsumptionComponent;

  @ViewChild('averageCostPerMonth', { static: false })
  averageCostPerMonth: ElementRef;

  @ViewChild('averageCostPerYear', { static: false })
  averageCostPerYear: ElementRef;

  currency$: Observable<string>;
  detailedProduct$: Observable<TmaProduct>;

  showDetailedPrices: boolean;
  productSpecificationForViewDetails: boolean;
  productSpecificationForAverageCost: boolean;
  consumption: number;
  currency: string;
  detailedProduct: TmaProduct;

  protected consumptionChangeServiceSubject: Subscription;

  constructor(
    public priceService: TmaPriceService,
    protected productService: ProductService,
    protected currencyService: CurrencyService,
    protected consumptionConfig: TmaConsumptionConfig,
    protected productSpecificationProductService: TmaProductService,
    protected consumptionChangeService: TmaConsumptionChangeService,
    protected billingFrequencyConfig: TmaBillingFrequencyConfig
  ) {
    super();
  }

  ngOnInit(): void {
    this.showDetailedPrices = false;

    const usageUnit: TmaUsageUnit = this.getUsageUnit(this.product, this.consumptionComponent);

    if (this.product && this.product.productSpecification) {
      this.productSpecificationForViewDetails = this.productSpecificationProductService.isProductSpecificationForViewDetails(this.product.productSpecification.id);
      this.productSpecificationForAverageCost = this.productSpecificationProductService.isProductSpecificationForAverageCost(this.product.productSpecification.id);

      if ((this.productSpecificationForAverageCost || this.productSpecificationForViewDetails) && this.consumptionComponent) {
        this.consumption = this.getConsumption(this.product.productSpecification.id, usageUnit.id);

        this.detailedProduct$ = this.productService.get(this.product.code);
        this.detailedProduct$
          .pipe(first((prod: TmaProduct) => prod != null))
          .subscribe((prod: TmaProduct) => {
            this.detailedProduct = prod;
          });
      }
    }

    this.currency$ = this.currencyService.getActive();
    this.currency$
      .pipe(first((curr: string) => curr !== null && curr !== ''))
      .subscribe((curr: string) => this.currency = curr);

    this.consumptionChangeServiceSubject = this.consumptionChangeService.consumption$.subscribe((consumptionInformation) => {
      if (consumptionInformation.productSpecification === this.product.productSpecification.id) {
        this.consumption = this.getConsumption(this.product.productSpecification.id, usageUnit.id);
        this.averageCostPerMonth.nativeElement.innerText = this.getAverageCostPerMonth(this.detailedProduct, this.currency);
        this.averageCostPerYear.nativeElement.innerText = this.getAverageCostPerYear(this.detailedProduct, this.currency);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.consumptionChangeServiceSubject) {
      this.consumptionChangeServiceSubject.unsubscribe();
    }
  }

  /**
   * Changes the value of show detailed prices to show/hide.
   */
  changeShowDetailedPrices() {
    this.showDetailedPrices = !this.showDetailedPrices;
  }

  /**
   * Retrieves the average cost per month.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @return the average cost per month
   */
  getAverageCostPerMonth(product: TmaProduct, currency: string): string {
    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerMonth(product, currency, this.consumption, this.getTermValue()));
  }

  /**
   * Retrieves the average cost per year.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @return the average cost per year
   */
  getAverageCostPerYear(product: TmaProduct, currency: string): string {
    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerYear(product, currency, this.consumption, this.getTermValue()));
  }

  /**
   * Retrieves the term value of a product specification.
   *
   * @return the term value
   */
  getTermValue(): number {
    const term: string = this.getTerm(this.product, this.consumptionComponent);
    if (!term) {
      return 1;
    }

    const billingFrequency: TmaBillingFrequencyMap = this.billingFrequencyConfig.billingFrequency
      .find((frequency: TmaBillingFrequencyMap) => frequency.key === term);

    if (billingFrequency) {
      return billingFrequency.value;
    }

    return 1;
  }

  protected getConsumption(productSpecification: string, usageUnit: string): number {
    const consumptionFromLocalStorage = localStorage.getItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit);

    if (consumptionFromLocalStorage) {
      return Number(consumptionFromLocalStorage);
    }

    const defaultConsumptionValue = this.consumptionConfig.consumption.defaultValues.find((consumptionValue: TmaConsumptionValue) => consumptionValue.productSpecification === productSpecification && consumptionValue.usageUnit === usageUnit);
    if (!defaultConsumptionValue) {
      const consumptionValue = this.consumptionConfig.consumption.default;
      localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, consumptionValue);
      return Number(consumptionValue);
    }

    localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, defaultConsumptionValue.value);
    return Number(defaultConsumptionValue.value);
  }

  protected getTerm(product: TmaProduct, consumptionComponent: TmaCmsConsumptionComponent): string {
    if (!product || !consumptionComponent) {
      return '';
    }

    const keyValueList: string[] = Object.keys(consumptionComponent.searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1 || !product.productSpecification) {
      return '';
    }

    const keyForConsumptionComponent = keyValueList.find((keyValue: string) => {
      if (consumptionComponent.searchByConsumptionComponents[keyValue].productSpecification) {
        return consumptionComponent.searchByConsumptionComponents[keyValue].productSpecification.id === product.productSpecification.id;
      }
      return null;
    }
    );

    if (keyForConsumptionComponent &&
      consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent] &&
      consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent].billingFrequency
    ) {
      return consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent].billingFrequency;
    }

    return '';
  }

  protected getUsageUnit(product: TmaProduct, consumptionComponent: TmaCmsConsumptionComponent): TmaUsageUnit {
    if (!product || !consumptionComponent) {
      return null;
    }

    const keyValueList: string[] = Object.keys(consumptionComponent.searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1 || !product.productSpecification) {
      return null;
    }

    const keyForConsumptionComponent = keyValueList.find((keyValue: string) => {
      if (consumptionComponent.searchByConsumptionComponents[keyValue].productSpecification) {
        return consumptionComponent.searchByConsumptionComponents[keyValue].productSpecification.id === product.productSpecification.id;
      }
      return null;
    }
    );

    if (keyForConsumptionComponent &&
      consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent] &&
      consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent].usageUnit
    ) {
      return consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent].usageUnit;
    }

    return null;
  }
}
