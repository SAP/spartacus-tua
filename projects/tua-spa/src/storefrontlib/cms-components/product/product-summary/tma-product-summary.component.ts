import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { CmsService, ContentSlotComponentData, CurrencyService, Page } from '@spartacus/core';
import { CurrentProductService, ModalRef, ModalService, ProductSummaryComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { TmaBillingFrequencyConfig, TmaBillingFrequencyMap } from '../../../../core/config/billing-frequency/config';
import { TmaConsumptionConfig } from '../../../../core/config/consumption/config';
import { SEPARATOR, TmaCmsConsumptionComponent, TmaConsumptionValue, TmaProduct, TmaUsageUnit } from '../../../../core/model';
import { TmaPriceService, TmaProductService } from '../../../../core';
import { TmaConsumptionDialogComponent } from '../../consumption';

@Component({
  selector: 'cx-product-summary',
  templateUrl: './tma-product-summary.component.html',
  styleUrls: ['./tma-product-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaProductSummaryComponent extends ProductSummaryComponent implements OnInit {

  @ViewChild('consumptionValue', { static: false })
  consumptionValue: ElementRef;

  @ViewChild('averageCostPerMonth', { static: false })
  averageCostPerMonth: ElementRef;

  @ViewChild('averageCostPerYear', { static: false })
  averageCostPerYear: ElementRef;

  product$: Observable<TmaProduct>;
  url$: Observable<UrlSegment[]>;
  page$: Observable<Page>;
  currency$: Observable<string>;

  protected consumption: number;
  protected modalRef: ModalRef;

  constructor(
    public priceService: TmaPriceService,
    public productSpecificationProductService: TmaProductService,
    protected currentProductService: CurrentProductService,
    protected activatedRoute: ActivatedRoute,
    protected cmsService: CmsService,
    protected consumptionConfig: TmaConsumptionConfig,
    protected modalService: ModalService,
    protected currencyService: CurrencyService,
    protected billingFrequencyConfig: TmaBillingFrequencyConfig
  ) {
    super(currentProductService);
  }

  ngOnInit(): void {
    this.url$ = this.activatedRoute.url;
    this.page$ = this.cmsService.getCurrentPage();
    this.currency$ = this.currencyService.getActive();
  }

  /**
   * Retrieves the consumption component based on the product's product specification
   *
   * @param page The current page
   * @param product The provided product
   * @return The consumption component as {@link TmaCmsConsumptionComponent}
   */
  getConsumptionComponent(page: Page, product: TmaProduct): TmaCmsConsumptionComponent {
    const consumptionSlotKey: string = Object.keys(page.slots)
      .find((key: string) => page.slots[key].components.find((component: ContentSlotComponentData) => component.typeCode === 'ConsumptionListComponent'));

    if (!consumptionSlotKey) {
      return null;
    }

    const consumptionSlot = page.slots[consumptionSlotKey];

    const consumptionComponentList: TmaCmsConsumptionComponent[] = [];
    consumptionSlot.components.forEach((component: ContentSlotComponentData) => {
      this.cmsService.getComponentData(component.uid)
        .pipe(first((consumptionComp: TmaCmsConsumptionComponent) => consumptionComp != null))
        .subscribe((consumptionComp: TmaCmsConsumptionComponent) => consumptionComponentList.push(consumptionComp));
    });

    if (!consumptionComponentList || consumptionComponentList.length === 0) {
      return null;
    }

    const keyValueList: string[] = Object.keys(consumptionComponentList[0].searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1) {
      return null;
    }

    const consumptionComponent: TmaCmsConsumptionComponent = Object.assign({}, consumptionComponentList[0]);
    consumptionComponent.searchByConsumptionComponents = [];

    keyValueList.forEach((keyValue: string) => {
      if (consumptionComponentList[0].searchByConsumptionComponents[keyValue].productSpecification.id === product.productSpecification.id) {
        consumptionComponent.searchByConsumptionComponents[keyValue] = consumptionComponentList[0].searchByConsumptionComponents[keyValue];
      }
    });

    return consumptionComponent;
  }

  /**
   * Returns the formatted form of the consumption component.
   *
   * @param consumptionComponent The consumption component
   * @return String containing the formatted consumption
   */
  getFormattedConsumptionList(consumptionComponent: TmaCmsConsumptionComponent): string[] {
    if (!consumptionComponent ||
      !consumptionComponent.searchByConsumptionComponents) {
      return [];
    }

    const keyValueList: string[] = Object.keys(consumptionComponent.searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1) {
      return [];
    }

    const consumptionDisplayList: string[] = [];

    keyValueList.forEach((keyValue: string) => {
      const consumptionDetails = consumptionComponent.searchByConsumptionComponents[keyValue];

      consumptionDisplayList.push(
        this.getConsumption(consumptionDetails.productSpecification.id, consumptionDetails.usageUnit.id)
        + ' ' + consumptionDetails.usageUnit.name
        + '/' + consumptionDetails.billingFrequency
      );
    });

    return consumptionDisplayList;
  }

  /**
   * Updates the consumption values.
   *
   * @param product The provided product
   * @param currency The currency of the consumption price
   * @param consumptionComponent The consumption component
   * @param url The URL parameters
   */
  updateConsumption(product: TmaProduct, currency: string, consumptionComponent: TmaCmsConsumptionComponent, url: UrlSegment[]): void {
    let urlString = '';
    url.forEach((urlSegment: UrlSegment) => urlString += '/' + urlSegment);
    this.openModal(product, currency, consumptionComponent, urlString);
  }

  /**
   * Retrieved the average cost per month.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @param consumptionComponent The consumption component
   * @return the average cost per month
   */
  getAverageCostPerMonth(product: TmaProduct, currency: string, consumptionComponent: TmaCmsConsumptionComponent): string {
    if (!this.consumption) {
      const usageUnit: TmaUsageUnit = this.getUsageUnit(product, consumptionComponent);
      this.consumption = this.getConsumption(product.productSpecification.id, usageUnit.id);
    }
    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerMonth(product, currency, this.consumption, this.getTermValue(product, consumptionComponent)));
  }

  /**
   * Retrieves the average cost per year.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @param consumptionComponent The consumption component
   * @return the average cost per year
   */
  getAverageCostPerYear(product: TmaProduct, currency: string, consumptionComponent: TmaCmsConsumptionComponent): string {
    if (!this.consumption) {
      const usageUnit: TmaUsageUnit = this.getUsageUnit(product, consumptionComponent);
      this.consumption = this.getConsumption(product.productSpecification.id, usageUnit.id);
    }
    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerYear(product, currency, this.consumption, this.getTermValue(product, consumptionComponent)));
  }

  protected getConsumption(productSpecification: string, usageUnit: string): number {
    let consumption: string = null;
    this.activatedRoute.queryParams.subscribe(params => {
      consumption = params['consumption'];
    });

    if (consumption) {
      return Number(consumption);
    }

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

  protected openModal(product: TmaProduct, currency: string, consumptionComponent: TmaCmsConsumptionComponent, url: string) {
    this.modalRef = this.modalService.open(TmaConsumptionDialogComponent, {
      centered: true,
      size: 'lg'
    });

    const modalInstance: any = this.modalRef.componentInstance;
    modalInstance.consumptionComponent = consumptionComponent;
    modalInstance.url = url;
    modalInstance.updateConsumption.subscribe(consumption => {
      this.consumption = consumption;
      this.consumptionValue.nativeElement.innerText = this.getFormattedConsumptionList(consumptionComponent);
      this.averageCostPerMonth.nativeElement.innerText = this.getAverageCostPerMonth(product, currency, consumptionComponent);
      this.averageCostPerYear.nativeElement.innerText = this.getAverageCostPerYear(product, currency, consumptionComponent);
    });
  }

  protected getTermValue(product: TmaProduct, consumptionComponent: TmaCmsConsumptionComponent): number {

    const term = this.getTerm(product, consumptionComponent);
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

  protected getTerm(product: TmaProduct, consumptionComponent: TmaCmsConsumptionComponent): string {
    if (!product || !consumptionComponent) {
      return '';
    }

    const keyValueList: string[] = Object.keys(consumptionComponent.searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1) {
      return '';
    }

    const keyForConsumptionComponent = keyValueList.find((keyValue: string) =>
      consumptionComponent.searchByConsumptionComponents[keyValue].productSpecification.id === product.productSpecification.id
    );

    if (consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent] &&
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
