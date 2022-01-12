import { Observable, Subject } from 'rxjs';
import { Country, UserAddressService } from '@spartacus/core';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  GeographicAddress,
  GeographicAddressService,
  TmaOrderEntry,
  TmaPlace,
  TmaPlaceRole,
  TmaProduct
} from '../../../../../core';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { JourneyChecklistInstallationAddressFormComponent } from '../journey-checklist-installation-address-form';

@Component({
  selector: 'cx-journey-checklist-installation-address-display',
  templateUrl:
    './journey-checklist-installation-address-display.component.html',
  styleUrls: [
    './journey-checklist-installation-address-display.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JourneyChecklistInstallationAddressDisplayComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @Input()
  item?: TmaOrderEntry;

  @Input()
  productCode?: string;

  @Input()
  tmaProduct?: TmaProduct;

  @Input()
  addInstallationAddress?: boolean;

  @Input()
  showEdit?: boolean;

  modalRef: ModalRef;
  installationAddress: TmaPlace;
  country$: Observable<Country>;

  protected destroyed$ = new Subject();

  ngOnInit(): void {
    this.changeDetectorRef.markForCheck();
    this.installationAddress = this.getItemInstallationAddress(this.item);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  constructor(
    protected modalService: ModalService,
    public geographicAddressService?: GeographicAddressService,
    protected userAddressService?: UserAddressService,
    private changeDetectorRef?: ChangeDetectorRef
  ) {}

  /**
   * Opens {@link JourneyChecklistInstallationAddressFormComponent} passing the necessary data
   *
   * @param installationAddress of {@link TmaPlace}
   * @param geographicAddress of of {@link GeographicAddress}
   */
  updateInstallationAddress(
    installationAddress?: TmaPlace,
    geographicAddress?: GeographicAddress
  ): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(
      JourneyChecklistInstallationAddressFormComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: true
      }
    );
    modalInstance = this.modalRef.componentInstance;
    modalInstance.isEdit =
      !!(installationAddress || geographicAddress);
    modalInstance.currentAddress = installationAddress
      ? installationAddress
      : geographicAddress;
    modalInstance.item = this.item ? this.item : undefined;
    modalInstance.tmaProduct = this.tmaProduct ? this.tmaProduct : undefined;
  }

  /**
   * Gets Installation Address from  cart Item
   *
   * @param item of {@link TmaOrderEntry}
   * @returns installationAddress of {@link TmaPlace}
   */
  getItemInstallationAddress(item: TmaOrderEntry): TmaPlace {
    if (item && item.subscribedProduct && item.subscribedProduct.place) {
      return item.subscribedProduct.place.find(
        (address: TmaPlace) =>
          address.role === TmaPlaceRole.INSTALLATION_ADDRESS
      );
    }
  }

  /**
   * Gets country installation address
   */
  getCountry(isoCode: string): void {
    this.country$ = this.userAddressService.getCountry(isoCode);
  }
}
