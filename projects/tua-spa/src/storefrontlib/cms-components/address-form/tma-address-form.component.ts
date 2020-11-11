import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Region, UserAddressService } from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TmaInstallationAddress } from '../../../core';

@Component({
    selector: 'cx-address-form',
    templateUrl: './tma-address-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaAddressFormComponent implements OnInit {

    @Input()
    address: TmaInstallationAddress;

    @Input()
    isDialog: boolean;

    @Output()
    countrySelected = new EventEmitter<any>();

    @Output()
    regionSelected = new EventEmitter<any>();

    countries$: Observable<Country[]>;
    regions$: Observable<Region[]>;

    protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<Country>({});
    protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<Region>({});

    installationAddress: FormGroup = this.fb.group({
        buildingNumber: ['', Validators.required],
        streetName: ['', Validators.required],
        apartmentNumber: [''],
        city: ['', Validators.required],
        country: this.fb.group({
            isocode: [null, Validators.required]
        }),
        region: this.fb.group({
            isocode: [null, Validators.required]
        }),
        postalCode: ['', Validators.required],
    })

    constructor(
        public controlContainer: ControlContainer,
        protected fb: FormBuilder,
        protected userAddressService: UserAddressService
    ) { }

    ngOnInit() {
        //Fetching countries
        this.countries$ = this.userAddressService.getDeliveryCountries().pipe(
            tap((countries: Country[]) => {
                if (Object.keys(countries).length === 0) {
                    this.userAddressService.loadDeliveryCountries();
                }
            })
        );

        // Fetching regions
        this.regions$ = this.selectedCountry$.pipe(
            switchMap((country: Country) => this.userAddressService.getRegions(country.isocode)),
            tap((regions: Region[]) => {
                const regionControl: AbstractControl = this.installationAddress.get('region.isocode');
                if (regions && regions.length > 0) {
                    regionControl.enable();
                }
                else {
                    regionControl.disable();
                }
            })
        );
        this.updateInstallationAddress();
    }

    /**
     * Sets up the isocode for the selected country
     * 
     * @param country - the selected country
     */
    onCountrySelected(country: Country): void {
        this.installationAddress['controls'].country['controls'].isocode.setValue(
            country.isocode
        );
        this.selectedCountry$.next(country);
        this.countrySelected.emit(country);
    }

    /**
     * Sets up the isocode for the selected region
     * 
     * @param region - the selected region
     */
    onRegionSelected(region: Region): void {
        this.installationAddress['controls'].region['controls'].isocode.setValue(
            region.isocode
        );
        this.regionSelected.emit(region);
    }

    updateInstallationAddress(): void {
        if (this.address && this.address.buildingNumber) {
          this.installationAddress['controls'].buildingNumber.setValue(this.address.buildingNumber);
        }

        if (this.address && this.address.streetName) {
          this.installationAddress['controls'].streetName.setValue(this.address.streetName);
        }

        if (this.address && this.address.apartmentNumber) {
          this.installationAddress['controls'].apartmentNumber.setValue(this.address.apartmentNumber);
        }

        if (this.address && this.address.country && this.address.country.isocode) {
          this.installationAddress['controls'].country['controls'].isocode.setValue(
            this.address.country.isocode
          );
          this.selectedCountry$.next(this.address.country);
          this.countrySelected.emit(this.address.country);
        }

        if (this.address && this.address.region && this.address.region.isocode) {
          this.installationAddress['controls'].region['controls'].isocode.setValue(
            this.address.region.isocode
          );
          this.selectedRegion$.next(this.address.region);
          this.regionSelected.emit(this.address.region);
        }

        if (this.address && this.address.postalCode) {
          this.installationAddress['controls'].postalCode.setValue(this.address.postalCode);
        }

        if (this.address && this.address.city) {
          this.installationAddress['controls'].city.setValue(this.address.city);
        }
    }
}