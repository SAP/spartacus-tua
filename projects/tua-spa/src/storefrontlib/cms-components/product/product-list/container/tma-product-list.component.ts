import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { CmsService, ContentSlotComponentData, Page } from '@spartacus/core';
import {
  ModalRef,
  ModalService,
  PageLayoutService,
  ProductListComponent,
  ProductListComponentService,
  ViewConfig
} from '@spartacus/storefront';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { TmaConsumptionConfig } from '../../../../../core/config/consumption/config';
import { SEPARATOR, TmaCmsConsumptionComponent, TmaConsumptionValue } from '../../../../../core/model';
import { TmaConsumptionDialogComponent } from '../../../consumption';

@Component({
  selector: 'cx-product-list',
  templateUrl: './tma-product-list.component.html',
  styleUrls: ['./tma-product-list.component.scss']
})
export class TmaProductListComponent extends ProductListComponent implements OnInit, OnDestroy {

  @ViewChild('consumptionValue', { static: false })
  consumptionValue: ElementRef;

  url$: Observable<UrlSegment[]>;
  page$: Observable<Page>;

  protected queryParams: Params;
  protected consumption: number;
  protected modalRef: ModalRef;

  protected queryParamsSubject: Subject<Params>;

  constructor(
    protected pageService: PageLayoutService,
    protected productListService: ProductListComponentService,
    protected consumptionConfig: TmaConsumptionConfig,
    protected activatedRoute: ActivatedRoute,
    protected cmsService: CmsService,
    protected viewConfig: ViewConfig,
    protected modalService: ModalService
  ) {
    super(pageService, productListService, viewConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.url$ = this.activatedRoute.url;
    this.page$ = this.cmsService.getCurrentPage();

    this.activatedRoute.queryParams
      .subscribe((params: Params) => this.queryParams = params);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.queryParamsSubject) {
      this.queryParamsSubject.unsubscribe();
    }
  }

  /**
   * Displays the consumption component.
   */
  updateConsumption(consumptionComponent: TmaCmsConsumptionComponent): void {
    this.openModal(consumptionComponent);
  }

  /**
   * Returns the formatted form of the consumption component provided.
   *
   * @param consumptionComponent The consumption to be formatted
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
   * Retrieves the consumption component on the page.
   * @param page The current page
   * @return The component as {@link TmaCmsConsumptionComponent}
   */
  getConsumptionComponent(page: Page): TmaCmsConsumptionComponent {
    const consumptionSlotKey: string = Object.keys(page.slots)
      .find((key: string) => page.slots[key].components.find((component: ContentSlotComponentData) => component.typeCode === 'ConsumptionListComponent'));

    if (!consumptionSlotKey) {
      return null;
    }

    const consumptionSlot = page.slots[consumptionSlotKey];

    const consumptionComponentList: TmaCmsConsumptionComponent[] = [];
    consumptionSlot.components.forEach((component: ContentSlotComponentData) => {
      this.cmsService.getComponentData(component.uid)
        .pipe(first((consumptionComponent: TmaCmsConsumptionComponent) => consumptionComponent != null))
        .subscribe((consumptionComponent: TmaCmsConsumptionComponent) => consumptionComponentList.push(consumptionComponent));
    });

    if (!consumptionComponentList || consumptionComponentList.length === 0) {
      return null;
    }

    return consumptionComponentList[0];
  }

  protected getConsumption(productSpecification: string, usageUnit: string): string {
    let consumption: string = null;
    this.activatedRoute.queryParams.subscribe(params => {
      consumption = params['consumption'];
    });

    if (consumption) {
      this.consumption = Number(consumption);
      return consumption;
    }

    const consumptionFromLocalStorage = localStorage.getItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit);

    if (consumptionFromLocalStorage) {
      return consumptionFromLocalStorage;
    }

    const defaultConsumptionValue = this.consumptionConfig.consumption.defaultValues.find((consumptionValue: TmaConsumptionValue) => consumptionValue.productSpecification === productSpecification && consumptionValue.usageUnit === usageUnit);
    if (!defaultConsumptionValue) {
      const consumptionValue = this.consumptionConfig.consumption.default;
      localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, consumptionValue);
      return consumptionValue;
    }

    localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, defaultConsumptionValue.value);
    return defaultConsumptionValue.value;
  }

  protected openModal(consumptionComponent: TmaCmsConsumptionComponent) {
    this.modalRef = this.modalService.open(TmaConsumptionDialogComponent, {
      centered: true,
      size: 'lg'
    });

    const modalInstance: any = this.modalRef.componentInstance;
    modalInstance.consumptionComponent = consumptionComponent;
    modalInstance.queryParams = this.queryParams;
    modalInstance.updateConsumption.subscribe(_ => {
      this.consumptionValue.nativeElement.innerText = this.getFormattedConsumptionList(consumptionComponent);
    });
  }
}
