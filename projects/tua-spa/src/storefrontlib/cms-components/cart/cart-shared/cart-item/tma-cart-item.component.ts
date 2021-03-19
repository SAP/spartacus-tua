import { OnDestroy } from '@angular/core';
import { GlobalMessageService, GlobalMessageType, ProductService, TranslationService, BaseSiteService } from '@spartacus/core';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { Subject } from 'rxjs';
import { filter, first, takeUntil, take, distinctUntilChanged, map } from 'rxjs/operators';
import {
  Appointment,
  TmaInstallationAddressConverter,
  TmaPremiseDetailInteractionService,
  TmaPremiseDetailService,
  TmaProcessType,
  TmaSubscriptionTerm,
  TmaChecklistActionService,
  TmaChecklistActionTypeCheckService,
  JourneyChecklistConfig,
  LogicalResource,
  LogicalResourceType,
  TmaActionType,
  TmaAddress,
  TmaCartPrice,
  TmaCharacteristic,
  TmaMeter,
  TmaOrderEntry,
  TmaPlace,
  TmaPlaceRole,
  TmaPremiseDetail,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaRelatedParty,
  TmaRelatedPartyRole,
  TmaSubscribedProduct,
  TmaTechnicalResource,
  TmaTechnicalResources,
  TmaChecklistAction,
  TmaCartPriceService,
  TmaCartService,
  LogicalResourceReservationService,
  TmaProductService
} from '../../../../../core';
import { Component, Input, OnInit } from '@angular/core';
import {
  CartItemComponent,
  PromotionService
} from '@spartacus/storefront';
import { CurrencyService, OrderEntry } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaUserAddressService } from '../../../../../core/user/facade/tma-user-address.service';
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
  styleUrls: ['./tma-cart-item.component.scss']
})
export class TmaCartItemComponent extends CartItemComponent implements OnInit, OnDestroy {
  @Input()
  item: TmaItem;

  @Input()
  displayPrices = true;

  @Input()
  isRemovable: boolean;

  @Input()
  showEdit?: boolean;

  @Input()
  qtyDisabled = false;

  @Input()
  isPremiseDetailsReadOnly: boolean;

  premiseDetails: TmaPremiseDetail;
  serviceProvider: string;
  product$: Observable<TmaProduct>;
  currency$: Observable<string>;
  itemLogicalResources: LogicalResource[];
  checklistAction$: TmaChecklistAction[];
  protected modalRef: ModalRef;
  protected destroyed$ = new Subject();
  protected baseSiteId: string;

  constructor(
    public cartPriceService: TmaCartPriceService,
    public checklistActionTypeCheckService: TmaChecklistActionTypeCheckService,
    protected currencyService: CurrencyService,
    protected promotionService: PromotionService,
    public productSpecificationProductService?: TmaProductService,
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
    protected config?: JourneyChecklistConfig
  ) {
    super(promotionService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.serviceProvider = this.getServiceProvider(this.item);
    this.product$ = this.productService.get(this.item.product.code);
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
        if (this.checkPremiseValidity(result)) {
          const orderEntry: TmaOrderEntry = {
            entryNumber: this.item.entryNumber,
            subscribedProduct: {
              characteristic: [
                {
                  name: 'meter_id',
                  value: premiseDetails.meter.id
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

  private getMeterValue(subscribedProduct: TmaSubscribedProduct): string {
    const characteristic = subscribedProduct.characteristic.find((tmaCharacteristic: TmaCharacteristic) =>
      tmaCharacteristic.name === 'meter_id');
    if (characteristic) {
      return characteristic.value;
    }
    return;
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
