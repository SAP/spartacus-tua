import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Region, UserAddressService } from '@spartacus/core';
import { ICON_TYPE, ModalService } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { TmaInstallationAddress, TmaPremiseDetail } from '../../../../../core/model';
import { TmaAddressFormComponent } from '../../../address-form';

@Component({
  selector: 'cx-premise-details-form',
  templateUrl: './tma-premise-details-form.component.html',
  styleUrls: ['./tma-premise-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPremiseDetailsFormComponent implements OnInit, AfterViewInit {

  @Input()
  premiseDetail: TmaPremiseDetail;

  @Input()
  isDialog: boolean;

  @Output()
  validatePremiseDetails = new EventEmitter<any>();

  @ViewChild(TmaAddressFormComponent, { static: true})
  addressComponent!: TmaAddressFormComponent;

  iconTypes = ICON_TYPE;
  country: Country;
  region: Region;
  installationAddress: TmaInstallationAddress;

  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<Country>({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<Region>({});
  protected meterType: string;

  premiseDetails: FormGroup = this.fb.group({
    meterId: ['', Validators.required]
  });

  constructor(
    protected fb: FormBuilder,
    protected userAddressService: UserAddressService,
    protected modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    if (this.premiseDetail && this.premiseDetail.installationAddress){
      this.installationAddress = this.premiseDetail.installationAddress;
    }
    this.updatePremiseDetailInputs();
  }

  ngAfterViewInit() {
    this.premiseDetails.addControl('installationAddress', this.addressComponent.installationAddress);
    this.addressComponent.installationAddress.setParent(this.premiseDetails);
  }

  /**
     * Sets up the isocode for the selected country
     * 
     * @param country - the selected country
     */
  onCountrySelected(country: Country): void {
    this.selectedCountry$.next(country);
    this.selectedRegion$.next(null);
  }

  /**
     * Sets up the isocode for the selected region
     * 
     * @param region - the selected region
     */
  onRegionSelected(region: Region): void {
    this.selectedRegion$.next(region);
  }

  /**
   * Emits action for validating the provided premise details
   */
  onVerifyPremiseDetails(): void {
    this.premiseDetail = {
      installationAddress: {
        buildingNumber: this.premiseDetails['controls'].installationAddress['controls'].buildingNumber.value,
        streetName: this.premiseDetails['controls'].installationAddress['controls'].streetName.value,
        apartmentNumber: this.premiseDetails['controls'].installationAddress['controls'].apartmentNumber.value,
        city: this.premiseDetails['controls'].installationAddress['controls'].city.value,
        country: this.selectedCountry$.getValue(),
        region: (this.selectedRegion$.getValue() && this.selectedRegion$.getValue().isocode) ? this.selectedRegion$.getValue() :
          null,
        postalCode: this.premiseDetails['controls'].installationAddress['controls'].postalCode.value
      },
      meter: {
        id: this.premiseDetails['controls'].meterId.value,
        type: this.meterType
      }
    };

    this.validatePremiseDetails.emit(this.premiseDetail);
  }

  /**
   * Closes the popup modal
   * 
   * @param reason - reason for closing the modal
   */
  onDismissModal(reason?: any): void {
    this.modalService.dismissActiveModal(reason);
  }

  protected updatePremiseDetailInputs(): void {

    if (this.premiseDetail && this.premiseDetail.meter && this.premiseDetail.meter.id) {
      this.premiseDetails['controls'].meterId.setValue(this.premiseDetail.meter.id);
    }

    if (this.premiseDetail && this.premiseDetail.meter && this.premiseDetail.meter.type) {
      this.meterType = this.premiseDetail.meter.type;
    }
  }
}
