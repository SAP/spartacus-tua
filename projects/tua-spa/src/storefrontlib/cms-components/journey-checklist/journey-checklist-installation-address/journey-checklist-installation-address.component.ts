import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  AfterViewChecked,
  AfterViewInit
} from '@angular/core';
import { User, Country, Region } from '@spartacus/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GeographicAddressService } from '../../../../core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TmaPlace, TmaInstallationAddress } from '../../../../core/model';
import { TmaAddressFormComponent } from '../../address-form';

@Component({
  selector: 'cx-journey-checklist-installation-address',
  templateUrl: './journey-checklist-installation-address.component.html',
})
export class JourneyChecklistInstallationAddressComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit  {
  @Input()
  installationAddressCheckList: string;

  @Input()
  checkListLengthApp: number;

  @Input()
  isEdit: boolean;

  @Input()
  currentAddress: TmaPlace;

  @Output()
  addressForm = new EventEmitter<FormGroup>();

  @ViewChild(TmaAddressFormComponent, { static: true })
  addressComponent!: TmaAddressFormComponent;

  installationAddress: TmaInstallationAddress;

  installationAddressDetails: FormGroup = this.fb.group({});

  protected activeUser: User;
  protected destroyed$ = new Subject();

  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<
    Country
  >({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<
    Region
  >({});

  constructor(
    public geographicAddressService: GeographicAddressService,
    protected fb: FormBuilder,
    protected changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.isEdit && this.currentAddress) {
      this.installationAddress = {
        buildingNumber: this.currentAddress.line1.split(',')[0],
        streetName: this.currentAddress.line1.split(',')[1],
        apartmentNumber: this.currentAddress.line2,
        city: this.currentAddress.town,
        country: this.currentAddress.country,
        region: this.currentAddress.region,
        postalCode: this.currentAddress.postalCode,
      };
    }
  }

  ngOnDestroy(): void {
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.geographicAddressService.clearGeographicAddressError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    this.installationAddressDetails.addControl(
      'installationAddress',
      this.addressComponent.installationAddress
    );
    this.addressComponent.installationAddress.setParent(
      this.installationAddressDetails
    );
  }

  isValid(invalid: boolean): void {
    if (!invalid) {
      this.addressForm.emit(this.installationAddressDetails);
    } else {
      this.addressForm.emit(undefined);
    }
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
}
