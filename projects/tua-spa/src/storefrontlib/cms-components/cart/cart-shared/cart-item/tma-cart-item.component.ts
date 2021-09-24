import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
  BaseSiteService,
  CmsService,
  ContentSlotComponentData,
  CurrencyService,
  GlobalMessageService,
  GlobalMessageType,
  OrderEntry,
  Page,
  ProductService,
  TranslationService
} from '@spartacus/core';
import { CartItemComponent, ModalRef, ModalService, PromotionService } from '@spartacus/storefront';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, take, takeUntil } from 'rxjs/operators';
import {
  Appointment,
  JourneyChecklistConfig,
  LogicalResource,
  LogicalResourceReservationService,
  LogicalResourceType,
  TmaActionType,
  TmaAddress,
  TmaBillingFrequencyConfig,
  TmaBillingFrequencyMap,
  TmaCartPrice,
  TmaCartPriceService,
  TmaCartService,
  TmaCharacteristic,
  TmaChecklistAction,
  TmaChecklistActionTypeCheckService,
  TmaCmsConsumptionComponent,
  TmaInstallationAddressConverter,
  TmaMeter,
  TmaOrderEntry,
  TmaPlace,
  TmaPlaceRole,
  TmaPremiseDetail,
  TmaPremiseDetailInteractionService,
  TmaPremiseDetailService,
  TmaPriceService,
  TmaProcessType,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaProductService,
  TmaRelatedParty,
  TmaRelatedPartyRole,
  TmaSubscribedProduct,
  TmaSubscriptionTerm,
  TmaTechnicalResource,
  TmaTechnicalResources,
  TmaUsageUnit,
  TmaChecklistActionService
} from '../../../../../core';
import { TmaUserAddressService } from '../../../../../core/user/facade/tma-user-address.service';
import { TmaConsumptionDialogComponent } from '../../../consumption';
import { TmaPremiseDetailsFormComponent } from '../../../premise-details';

export interface TmaItem extends OrderEntry {
  entries?: TmaItem[];
  entryNumber?: number;
  subscribedProduct?: TmaSubscribedProduct;
  cartPrice?: TmaCartPrice;
  entryGroupNumbers?: number[];
  rootBpoCode?: string;
  appointment?: Appointment;
  processType?: TmaProcessType;
  contractStartDate?: string;
  subscriptionTerm?: TmaSubscriptionTerm;
  action?: TmaActionType;
}

@Component({
  selector: 'cx-cart-item',
  templateUrl: './tma-cart-item.component.html',
  styleUrls: ['./tma-cart-item.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('false', style({ height: '0px', overflow: 'hidden' })),
      state('true', style({ height: '*' })),
      transition('1 => 0', animate('500ms ease-in')),
      transition('0 => 1', animate('500ms ease-out'))
    ])
  ]
})
export class TmaCartItemComponent extends CartItemComponent implements OnInit, OnDestroy {

  @ViewChild('consumptionValue', { static: false })
  consumptionValue: ElementRef;

  @ViewChild('averageCostPerMonth', { static: false })
  averageCostPerMonth: ElementRef;

  @ViewChild('averageCostPerYear', { static: false })
  averageCostPerYear: ElementRef;


  @Input()
  item: TmaItem;

  @Input()
  displayPrices = true;

  @Input()
  isRemovable: boolean;

  @Input()
  showEdit?: boolean;

  @Input()
  showConsumption?= true;

  @Input()
  qtyDisabled = false;

  @Input()
  isPremiseDetailsReadOnly: boolean;

  page$: Observable<Page>;
  premiseDetails: TmaPremiseDetail;
  serviceProvider: string;
  product$: Observable<TmaProduct>;
  currency$: Observable<string>;
  itemLogicalResources: LogicalResource[];
  checklistAction$: TmaChecklistAction[];
  detailedProduct$: Observable<TmaProduct>;
  productSpecificationForAverageCost: boolean;
  url$: Observable<UrlSegment[]>;

  protected modalRef: ModalRef;
  protected destroyed$ = new Subject();
  protected baseSiteId: string;
  protected consumption: number;
  protected isCurrentSelectionExpanded: boolean;

  constructor(
    public cartPriceService: TmaCartPriceService,
    public checklistActionTypeCheckService: TmaChecklistActionTypeCheckService,
    protected currencyService: CurrencyService,
    protected promotionService: PromotionService,
    public productSpecificationProductService?: TmaProductService,
    public priceService?: TmaPriceService,
    protected logicalResourceReservationService?: LogicalResourceReservationService,
    protected modalService?: ModalService,
    protected cartService?: TmaCartService,
    protected tmaUserAddressService?: TmaUserAddressService,
    protected tmaPremiseDetailService?: TmaPremiseDetailService,
    protected globalMessageService?: GlobalMessageService,
    protected tmaChecklistActionService?: TmaChecklistActionService,
    protected installationAddressConverter?: TmaInstallationAddressConverter,
    protected translationService?: TranslationService,
    protected productService?: ProductService,
    protected premiseDetailInteractionService?: TmaPremiseDetailInteractionService,
    protected baseSiteService?: BaseSiteService,
    protected config?: JourneyChecklistConfig,
    protected cmsService?: CmsService,
    protected billingFrequencyConfig?: TmaBillingFrequencyConfig,
    protected activatedRoute?: ActivatedRoute,
  ) {
    super(promotionService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.serviceProvider = this.getServiceProvider(this.item);
    this.product$ = this.productService.get(this.item.product.code);
    this.url$ = this.activatedRoute.url;
    this.page$ = this.cmsService.getCurrentPage();
    this.currency$ = this.currencyService.getActive();

    this.product$
      .pipe(
        takeUntil(this.destroyed$),
        first(prod => prod != null)
      )
      .subscribe(prod => this.premiseDetails = this.getPremiseDetails(prod));

    this.itemLogicalResources = this.getLogicalResources(
      this.item.subscribedProduct.characteristic
    );
    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => !!baseSiteId),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId));

    this.tmaChecklistActionService.getChecklistActionForProductCode(
      this.baseSiteId,
      this.item.product.code,
      this.item.processType.id
    ).pipe(
      take(2),
      filter((checklistResult: TmaChecklistAction[]) => !!checklistResult),
      distinctUntilChanged(),
      takeUntil(this.destroyed$),
      map((checklistResult: TmaChecklistAction[]) => {
        if (Object.keys(checklistResult).length !== 0) {
          const journeyCheckLists: TmaChecklistAction[] = checklistResult.filter(
            (checklist: TmaChecklistAction) =>
              this.config.journeyChecklist.journeyChecklistSteps.includes(
                checklist.actionType
              )
          );
          if (Object.keys(journeyCheckLists).length !== 0) {
            this.checklistAction$ = journeyCheckLists;
          }
          else {
            this.checklistAction$ = undefined;
          }
        }
        else {
          this.checklistAction$ = undefined;
        }
      })
    )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  removeItem() {
    if (!!this.itemLogicalResources) {
      this.logicalResourceReservationService.clearInvalidReservations(
        this.itemLogicalResources
      );
    }
    super.removeItem();
  }

  /**
   * Emits event for updating contract start date.
   *
   * @param contractStartDate - The new contract start date
   */
  onUpdateContractStartDate(contractStartDate: string): void {
    const orderEntry: TmaOrderEntry = {
      entryNumber: this.item.entryNumber,
      contractStartDate: contractStartDate
    };

    this.cartService.updateCartEntry(orderEntry);
  }

  /**
   * Updates the cart entry with move in information.
   */
  onMoveIn(): void {
    const orderEntry: TmaOrderEntry = {
      entryNumber: this.item.entryNumber,
      processType: {
        id: TmaProcessTypeEnum.ACQUISITION
      }
    };

    this.cartService.updateCartEntry(orderEntry);
  }

  onServiceProvider(): void {
    const orderEntry: TmaOrderEntry = {
      entryNumber: this.item.entryNumber,
      processType: {
        id: TmaProcessTypeEnum.SWITCH_SERVICE_PROVIDER
      }
    };

    this.cartService.updateCartEntry(orderEntry);
  }

  /**
   * Updates the cart entry with switch service provider information.
   *
   * @param serviceProvider - The current service provider
   */
  onSwitchServiceProvider(serviceProvider: string): void {
    const orderEntry: TmaOrderEntry = {
      entryNumber: this.item.entryNumber,
      processType: {
        id: TmaProcessTypeEnum.SWITCH_SERVICE_PROVIDER
      },
      subscribedProduct: {
        relatedParty: [
          {
            id: serviceProvider, role: TmaRelatedPartyRole.SERVICE_PROVIDER
          }
        ]
      }
    };

    this.cartService.updateCartEntry(orderEntry);
  }

  /**
   * Opens pop-up for providing new premise detail.
   *
   * @param premiseDetails - The current premise detail
   */
  onUpdatePremiseDetails(premiseDetails: TmaPremiseDetail): void {
    this.openModal(premiseDetails);
  }

  validatePremiseDetails(premiseDetails: TmaPremiseDetail): void {
    const validationResult = this.tmaPremiseDetailService.validatePremiseDetails(premiseDetails);
    validationResult
      .pipe(
        filter((result: TmaTechnicalResources) => !!result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: TmaTechnicalResources) => {
        const consumption: string = this.getAverageConsumption(this.item.subscribedProduct);
        if (this.checkPremiseValidity(result)) {
          const orderEntry: TmaOrderEntry = {
            entryNumber: this.item.entryNumber,
            subscribedProduct: {
              characteristic: [
                {
                  name: 'meter_id',
                  value: premiseDetails.meter.id
                },
                {
                  name: 'average_consumption_estimation',
                  value: consumption
                }
              ]
            }
          };

          this.cartService.updateCartEntry(orderEntry);
          this.tmaUserAddressService.updateUserAddress(this.getAddressId(this.item), this.installationAddressConverter.convertSourceToTarget(premiseDetails.installationAddress));
          this.premiseDetailInteractionService.updatePremiseDetail({
            premiseDetails: premiseDetails,
            entryNumber: this.item.entryNumber
          });
          this.premiseDetails = premiseDetails;
        }
        else {
          this.translationService.translate('premiseDetails.premiseDetailsValidation.fail').pipe(takeUntil(this.destroyed$))
            .subscribe((translatedMessage: string) => this.globalMessageService.add(translatedMessage, GlobalMessageType.MSG_TYPE_ERROR));
        }

        this.modalRef.dismiss();
      });
  }

  /**
   * Returns the currently selected purchase reason.
   *
   * @return The purchase reason as {@link string}
   */
  getPurchaseReason(): string {
    return this.item.processType.id === TmaProcessTypeEnum.SWITCH_SERVICE_PROVIDER ? 'switchProvider' : 'move';
  }

  /**
   * Returns the premise details based on information from cart item and product.
   *
   * @param product - The product offering
   * @return The premise details as {@link TmaPremiseDetail}
   */
  getPremiseDetails(product: TmaProduct): TmaPremiseDetail {
    return {
      installationAddress: this.installationAddressConverter.convertTargetToSource(this.getAddressFromItem(this.item)),
      meter: this.getMeter(product)
    };
  }

  /**
   * Checks if the cart item has installation address
   *
   * @return True {@link boolean} if cart item has installation address, otherwise false
   */
  hasInstallationAddress(): boolean {
    return !!(this.item &&
      this.item.subscribedProduct &&
      this.item.subscribedProduct.place &&
      this.item.subscribedProduct.place.find((place: TmaPlace) => place.role === TmaPlaceRole.INSTALLATION_ADDRESS));
  }

  /**
   * Checks if appointment is present in cart item
   *
   * @return True {@link boolean} if cart item has appointment, otherwise false
   */
  hasAppointment(): boolean {
    return !!(this.item.appointment && this.item.appointment.id);
  }

  /**
   * Checks if logical resource MSISDN present in cart item
   *
   * @return True {@link boolean} if cart item has logical resource MSISDN, otherwise false
   */
  isLogicalResourceMsisdn(): boolean {
    return !!(this.item &&
      this.item.subscribedProduct &&
      this.item.subscribedProduct.characteristic &&
      this.item.subscribedProduct.characteristic.find((tmaCharacteristic: TmaCharacteristic) => tmaCharacteristic.name === LogicalResourceType.MSISDN));
  }

  /**
   * Check Logical Resource present in cart item
   *
   * @return a {@link LogicalResource}
   */
  hasLogicalResource(): LogicalResource[] {
    if (this.item &&
      this.item.subscribedProduct &&
      this.item.subscribedProduct.characteristic) {
      return this.getLogicalResources(
        this.item.subscribedProduct.characteristic
      );
    }
    return;
  }

  getMeter(product: TmaProduct): TmaMeter {
    return this.item && this.item.subscribedProduct && this.item.subscribedProduct.characteristic ? {
      id: this.getMeterValue(this.item.subscribedProduct),
      type: product.productSpecification.id
    } : null;
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
   * Updates the consumption values.
   *
   * @param product The provided product
   * @param currency The currency of the consumption price
   * @param consumptionComponent The consumption component
   * @param url The URL parameters
   */
  updateConsumption(consumptionComponent: TmaCmsConsumptionComponent, url: UrlSegment[]): void {
    let urlString = '';
    url.forEach((urlSegment: UrlSegment) => urlString += '/' + urlSegment);
    this.openConsumptionModal(consumptionComponent, urlString);
  }

  /**
   * Returns the average estimated consumption
   *
   * @return average estimated consumption as {@link String}
   */
  getConsumptionEstimated(): string {
    if (this.item &&
      this.item.subscribedProduct &&
      this.item.subscribedProduct.characteristic) {
      return this.getAverageConsumption(
        this.item.subscribedProduct
      );
    }
  }

  /**
   * Retrieves the average cost per month.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @return the average cost per month
   */
  getAverageCostPerMonth(product: TmaProduct, currency: string): string {
    const billingFrequency: TmaBillingFrequencyMap = this.getBillingFrequency();

    if (billingFrequency) {
      return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerMonth(product, currency, this.getConsumption(), billingFrequency.value));
    }
    return;
  }

  /**
   * Retrieves the average cost per year.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @return the average cost per year
   */
  getAverageCostPerYear(product: TmaProduct, currency: string): string {
    const billingFrequency: TmaBillingFrequencyMap = this.getBillingFrequency();

    if (billingFrequency) {
      return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerYear(product, currency, this.getConsumption(), billingFrequency.value));
    }

  }

  /**
   * Expands the current selections.
   */
   expandCurrentSelection(): void {
    this.isCurrentSelectionExpanded = true;
  }

  /**
   * Collapses current selections.
   */
  collapseCurrentSelection(): void {
    this.isCurrentSelectionExpanded = false;
  }

  /**
   * Returns if current selection is collapsed.
   *
   * @return True if current selection is collapsed, otherwise false
   */
  isCurrentSelectionCollapsed(): boolean {
    return !this.isCurrentSelectionExpanded;
  }

/**
   * Checks for the given cart entries have the process type as renewal.
   *
   * @param items - The cart items
   *
   * @return true if cart item has process type as renewal as a {@link boolean}
   */
  isCartEntryForRenewal(items: TmaItem[]): boolean {
    const renewItem = items.find(
      (item: TmaItem) =>
        item.processType !== undefined &&
        item.processType.id === TmaProcessTypeEnum.RENEWAL
    );
    return renewItem !== undefined;
  }

  protected checkPremiseValidity(validationResult: TmaTechnicalResources): boolean {
    return !!(validationResult.technicalResources && validationResult.technicalResources.find((result: TmaTechnicalResource) => result !== ''));
  }

  protected getServiceProvider(item: TmaItem): string {
    this.serviceProvider = item &&
      item.subscribedProduct &&
      item.subscribedProduct.relatedParty ?
      item.subscribedProduct.relatedParty.find((relatedParty: TmaRelatedParty) => relatedParty.role === TmaRelatedPartyRole.SERVICE_PROVIDER).id :
      null;
    return this.serviceProvider;
  }

  protected getAddressId(item: TmaItem): string {
    return item && item.subscribedProduct && item.subscribedProduct.place ?
      item.subscribedProduct.place.find((place: TmaPlace) => place.role === TmaPlaceRole.INSTALLATION_ADDRESS).id : '';
  }

  protected getAddressFromItem(item: TmaItem): TmaAddress {
    const place = item && item.subscribedProduct && item.subscribedProduct.place ?
      item.subscribedProduct.place.find((address: TmaPlace) => address.role === TmaPlaceRole.INSTALLATION_ADDRESS) : null;

    return place ? {
      id: place.id,
      region: place.region,
      country: place.country,
      town: place.town,
      line1: place.line1,
      line2: place.line2,
      postalCode: place.postalCode
    } : null;
  }

  protected getLogicalResources(
    characteristics: TmaCharacteristic[]
  ): LogicalResource[] {
    const logicalResources: LogicalResource[] = [];
    if (!characteristics) {
      return;
    }
    characteristics.forEach((characteristic: TmaCharacteristic) => {
      if (
        !!characteristic.name &&
        Object.values(LogicalResourceType).includes(
          LogicalResourceType[characteristic.name.toUpperCase()]
        )
      ) {
        const logicalResource: LogicalResource = {};
        logicalResource.type =
          LogicalResourceType[characteristic.name.toUpperCase()];
        logicalResource.value = characteristic.value;
        logicalResources.push(logicalResource);
      }
    });
    return logicalResources;
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

  protected openConsumptionModal(consumptionComponent: TmaCmsConsumptionComponent, url: string) {
    this.modalRef = this.modalService.open(TmaConsumptionDialogComponent, {
      centered: true,
      size: 'lg'
    });

    const modalInstance: any = this.modalRef.componentInstance;
    modalInstance.consumptionComponent = consumptionComponent;
    modalInstance.url = url;
    modalInstance.cartEntryConsumption = String(this.getConsumption());
    modalInstance.updateConsumption.subscribe(consumption => {
      const consumptionEstimation: string = consumption + this.getAverageConsumption(
        this.item.subscribedProduct
      ).replace(/[0-9]/g, '');

      const orderEntry: TmaOrderEntry = {
        entryNumber: this.item.entryNumber,
        subscribedProduct: {
          characteristic: [
            {
              name: 'meter_id',
              value: this.premiseDetails.meter.id
            },
            {
              name: 'average_consumption_estimation',
              value: consumptionEstimation
            }
          ]
        }
      };

      this.cartService.updateCartEntry(orderEntry);
    });

  }

  private getMeterValue(subscribedProduct: TmaSubscribedProduct): string {
    const characteristic = subscribedProduct.characteristic.find((tmaCharacteristic: TmaCharacteristic) =>
      tmaCharacteristic.name === 'meter_id');
    if (characteristic) {
      return characteristic.value;
    }
    return;
  }

  private getAverageConsumption(
    subscribedProduct: TmaSubscribedProduct
  ): string {
    if (subscribedProduct.characteristic) {
      const characteristic = subscribedProduct.characteristic.find(
        (tmaCharacteristic: TmaCharacteristic) =>
          tmaCharacteristic.name === 'average_consumption_estimation'
      );
      if (characteristic) {
        return characteristic.value;
      }
    }
    return;
  }

  private getConsumption(): number{
    const avgConsumption = this.getAverageConsumption(
      this.item.subscribedProduct
    ).match(/[\d|,|.|e|E|\+]+/g);

    return Number(avgConsumption[0]);
  }

  private getBillingFrequency(): TmaBillingFrequencyMap{
    return this.billingFrequencyConfig.billingFrequency
      .find((frequency: TmaBillingFrequencyMap) => frequency.key === this.getAverageConsumption(
        this.item.subscribedProduct
      ).split('/')[1]);
  }

  private openModal(premiseDetails: TmaPremiseDetail) {
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaPremiseDetailsFormComponent, {
      centered: true,
      size: 'lg'
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.isDialog = true;
    modalInstance.premiseDetail = premiseDetails;
    modalInstance.validatePremiseDetails.subscribe(($e) => {
      this.validatePremiseDetails($e);
    });
  }

}
