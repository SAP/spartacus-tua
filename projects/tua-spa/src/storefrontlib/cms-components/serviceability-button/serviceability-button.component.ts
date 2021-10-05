import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { CmsComponentData, ModalService } from '@spartacus/storefront';
import { Country, OccConfig, Region } from '@spartacus/core';
import {
  TmaCmsServiceabilityBannerComponent,
  QueryServiceQualificationService,
  GeographicAddress,
  TmaProductSearchService,
  GeographicAddressService
} from '../../../core';
import { Subject } from 'rxjs';
import { ServiceabilityCategoryFormComponent } from './serviceability-category-form';

@Component({
  selector: 'cx-serviceability-button',
  templateUrl: './serviceability-button.component.html',
  styleUrls: ['./serviceability-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceabilityButtonComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  modalRef: any;
  baseUrl: string;
  buttonSwitch: boolean;
  installationAddress: GeographicAddress;
  country: Country;
  region: Region;
  systemNotAvailable: Boolean = false;

  protected destroyed$ = new Subject();

  constructor(
    public component: CmsComponentData<TmaCmsServiceabilityBannerComponent>,
    public tmaProductSearchService: TmaProductSearchService,
    public geographicAddressService?: GeographicAddressService,
    protected config?: OccConfig,
    protected changeDetectorRef?: ChangeDetectorRef,
    protected modalService?: ModalService,
    protected queryServiceQualificationService?: QueryServiceQualificationService
  ) {}

  ngOnInit() {
    this.buttonSwitch = false;
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Opens {@link ServiceabilityCategoryFormComponent} 
   *
   */
  displayAddressForm(): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(
      ServiceabilityCategoryFormComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: true,
        keyboard: false
      }
    );
    modalInstance = this.modalRef.componentInstance;
  }

  /**
   * Gets the address from session storage
   *
   * @returns of {@link GeographicAddress}
   */
  getDataFromStorage(): GeographicAddress {
    this.queryServiceQualificationService.getSelectedAddress();
    if (sessionStorage.getItem('Address')) {
      this.installationAddress = JSON.parse(sessionStorage.getItem('Address'));
      this.country = JSON.parse(sessionStorage.getItem('Country'));
      if (sessionStorage.getItem('Region')) {
        if (
          this.installationAddress.stateOfProvince ===
          JSON.parse(sessionStorage.getItem('Region')).isocode
        ) {
          this.region = JSON.parse(sessionStorage.getItem('Region'));
        }
      }
    }
    return this.installationAddress;
  }
}
