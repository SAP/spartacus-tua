import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  AfterContentChecked
} from '@angular/core';
import { SearchTimeSlotService } from '../../../../../core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  SearchTimeSlot,
  TimeSlot,
  TmaOrderEntry,
  TmaCart,
  Appointment,
  TmaTmfShoppingCart,
  TmaTmfCartItem,
  TmaPlace,
  TmaPlaceRole,
  RelatedPlaceRefOrValue,
  TmaInstallationAddress
} from '../../../../../core';
import { AppointmentService } from '../../../../../core';
import {
  User,
  UserService,
  BaseSiteService,
  OCC_USER_ID_ANONYMOUS,
  Country,
  Region
} from '@spartacus/core';
import {
  TmaTmfCartService,
  TmaActiveCartService,
  JourneyChecklistConfig,
  LOCAL_STORAGE
} from '../../../../../core';
import { first, take, takeUntil, filter, last } from 'rxjs/operators';
import { ModalService } from '@spartacus/storefront';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TmaAddressFormComponent } from '../../../address-form';

const { GEOGRAPHIC_ADDRESS } = LOCAL_STORAGE.INSTALLATION_ADDRESS;
const { INTERVENTION_ADDRESS } = LOCAL_STORAGE.APPOINTMENT;

@Component({
  selector: 'cx-journey-checklist-appointment-form',
  templateUrl: './journey-checklist-appointment-form.component.html',
  styleUrls: ['./journey-checklist-appointment-form.component.scss']
})
export class JourneyChecklistAppointmentFormComponent
  implements AfterContentChecked, OnInit, OnDestroy {
  @Input()
  isEdit: boolean;

  @Input()
  currentAppointmentId?: string;

  @Input()
  currentAppointment?: Appointment;

  @Input()
  item?: TmaOrderEntry;

  @Input()
  selectedTimeSlotPlace?: RelatedPlaceRefOrValue;

  @Output()
  addressForm = new EventEmitter<FormGroup>();

  @ViewChild(TmaAddressFormComponent, { static: false })
  addressComponent!: TmaAddressFormComponent;

  cartEntry: TmaOrderEntry;
  timeSlotChanged: boolean;
  searchTimeSlot$: Observable<SearchTimeSlot>;
  errPatch: any;
  searchTimeSlotError: string;
  installationAddress: TmaInstallationAddress;
  appointmentAddress: RelatedPlaceRefOrValue;
  isAppointmentAddress: Boolean = false;
  showTimeSlots: Boolean = true;
  appointmentAddressDetails: FormGroup = this.formBuilder.group({});
  ngbActiveIds = [];
  invalidAddress: Boolean = false;

  protected currentCart: TmaCart;
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected destroyed$ = new Subject();

  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<
    Country
  >({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<
    Region
  >({});

  constructor(
    protected tmaSearchTimeSlotService: SearchTimeSlotService,
    protected tmfAppointmentService: AppointmentService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected activeCartService: TmaActiveCartService,
    protected baseSiteService: BaseSiteService,
    protected userService: UserService,
    protected modalService: ModalService,
    protected spinner: NgxSpinnerService,
    protected config?: JourneyChecklistConfig,
    protected formBuilder?: FormBuilder,
    private changeDetectorRef?: ChangeDetectorRef
  ) {}

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    this.activeCartService
      .getActive()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((cart: TmaCart) => (this.currentCart = cart));

    this.userService
      .get()
      .pipe(
        first((user: User) => !!user),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: User) => (this.currentUser = user));

    this.baseSiteService
      .getActive()
      .pipe(
        first((baseSiteId: string) => !!baseSiteId),
        takeUntil(this.destroyed$)
      )
      .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId));

    this.timeSlotChanged = false;

    this.appointmentAddress = this.getAppointmentAddress(this.item);
    if (this.appointmentAddress) {
      this.getSearchTimeSlot(this.appointmentAddress);
    }
  }

  ngOnDestroy() {
    this.tmaSearchTimeSlotService.clearSearchTimeSlotErrorState();
    this.tmaSearchTimeSlotService.clearSearchTimeSlotState();
    this.tmfAppointmentService.clearAppointmentState();
    this.tmfAppointmentService.clearCreatedAppointmentState();
    this.tmfAppointmentService.clearAppointmentError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Close the model
   */
  closeModal(): void {
    this.modalService.dismissActiveModal(
      'close journey checklist appointment component'
    );
  }

  /**
   * Clears the selected search time slot from state and close the model.
   */
  closeAndClearModal(): void {
    this.tmaSearchTimeSlotService.clearSelectedSearchTimeSlotState();
    this.closeModal();
  }

/**
 * Sets the selected search time slot in state
 *
 * @param  timeSlot of {@link TimeSlot}
 * @param  place of {@link RelatedPlaceRefOrValue}
 */
selectedTimeSlot(timeSlot: TimeSlot, place: RelatedPlaceRefOrValue): void {
    this.tmaSearchTimeSlotService.setSelectedTimeSlot(timeSlot, place);
    this.timeSlotChanged = true;
  }

/**
 * Gets the configuration of requested number of time slot
 *
 * @returns string {@link string}
 */
getRequestedNumberOfTimeSlots(): string {
    return this.config.journeyChecklist.appointment.requested_number_of_timeslots.toString();
  }

/**
 * Gets the new search time slot on change of appointment address
 *
 */
getSearchTimeSlotOnAddressChange(): void {
    this.showTimeSlots = false;
    this.invalidAddress = false;
    this.toggleAppointmentAddress();
    this.searchTimeSlotError = null;
    this.tmaSearchTimeSlotService.clearSearchTimeSlotErrorState();
    this.tmaSearchTimeSlotService.clearSearchTimeSlotState();
    this.appointmentAddress = this.getInputAddress();
    this.populateFormAddress(this.appointmentAddress);
    if (this.appointmentAddress && !this.invalidAddress) {
      this.getSearchTimeSlot(this.appointmentAddress);
      this.showTimeSlots = true;
    }
  }

  /**
   * Update cart entry with appointment
   * If cart entry is undefined then close the appointment model
   * If cart entry is present with appointment then update appointment otherwise create appointment
   *
   */
  updateAppointment(): void {
    if (this.item === undefined) {
      this.closeModal();
      return;
    }
    if (this.currentAppointmentId) {
      this.tmfAppointmentService.updateAppointment(this.currentAppointmentId);
      this.tmfAppointmentService
        .getUpdateAppointmentError(this.currentAppointmentId)
        .pipe(
          take(2),
          filter((result: string) => !!result),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: string) => {
          this.errPatch = result;
          return;
        });
      this.tmfAppointmentService
        .getAppointmentById(this.currentAppointmentId)
        .pipe(
          take(2),
          filter((result: Appointment) => !!result),
          last(),
          takeUntil(this.destroyed$)
        )
        .subscribe((result: Appointment) => {
          const appointmentId = result.id;
          this.updateCart(appointmentId);
          this.spinner.hide();
          this.closeModal();
        });
    } else {
      this.tmfAppointmentService.createAppointmentForTimeSlot();
      this.createAppointment();
    }
  }

  /**
   * Sets up the isocode for the selected country
   *
   * @param country - the selected country
   */
  onCountrySelected(country: Country): void {
    sessionStorage.removeItem('Region');
    sessionStorage.setItem('Country', JSON.stringify(country));
    this.selectedCountry$.next(country);
    this.selectedRegion$.next(null);
  }

  /**
   * Sets up the isocode for the selected region
   *
   * @param region - the selected region
   */
  onRegionSelected(region: Region): void {
    sessionStorage.setItem('Region', JSON.stringify(region));
    this.selectedRegion$.next(region);
  }
/**
 * Toggle the appointment address form based on activeIds
 *
 */
toggleAppointmentAddress(): void {
    this.isAppointmentAddress = !this.isAppointmentAddress;
    if (this.isAppointmentAddress) {
      this.ngbActiveIds = ['address-panel'];
    } else {
      this.ngbActiveIds = [];
    }
  }

  protected updateCart(appointmentId: string): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: this.updateCartItems(appointmentId),
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  protected getSearchTimeSlot(place: RelatedPlaceRefOrValue): void {
    this.tmaSearchTimeSlotService
      .getSearchTimeSlotError()
      .pipe(
        take(2),
        filter((result: string) => !!result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: string) => {
        this.showTimeSlots = false;
        this.searchTimeSlotError = result;
        return;
      });
    this.searchTimeSlot$ = this.tmaSearchTimeSlotService.getAvailableSearchTimeSlot(
      place
    );
  }

  protected updateCartItems(appointmentId: string): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    cartItemList.push({
      id: this.item.entryNumber.toString(),
      appointment: {
        id: appointmentId
      }
    });
    return cartItemList;
  }

  protected createAppointment() {
    this.tmfAppointmentService
      .getCreateAppointmentError()
      .pipe(
        take(2),
        filter((result: string) => result != null),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: string) => {
        this.errPatch = result;
        return;
      });

    this.tmfAppointmentService
      .getCreatedAppointment()
      .pipe(
        take(2),
        filter(result => Object.keys(result).length !== 0),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: Appointment) => {
        const appointmentId = result.id;
        this.updateCart(appointmentId);
        this.spinner.hide();
        this.closeModal();
      });
  }

  protected getInputAddress(): RelatedPlaceRefOrValue {
    const address: RelatedPlaceRefOrValue = {
      role: INTERVENTION_ADDRESS,
      '@type': GEOGRAPHIC_ADDRESS
    };
    if (this.addressComponent && this.addressComponent.installationAddress) {
      if (this.addressComponent.installationAddress.status === 'INVALID') {
        this.invalidAddress = true;
      }
      address.streetName =
        this.addressComponent.installationAddress['controls'].buildingNumber
          .value +
        ',' +
        this.addressComponent.installationAddress['controls'].streetName.value;
      address.streetNr = this.addressComponent.installationAddress[
        'controls'
      ].apartmentNumber.value;
      address.postcode = this.addressComponent.installationAddress[
        'controls'
      ].postalCode.value;
      address.city = this.addressComponent.installationAddress[
        'controls'
      ].city.value;
      address.country = this.addressComponent.installationAddress[
        'controls'
      ].country.value['isocode'];
      address.stateOfProvince = this.addressComponent.installationAddress[
        'controls'
      ].region.value['isocode'];
    }
    return address;
  }

  private getAppointmentAddress(item: TmaOrderEntry): RelatedPlaceRefOrValue {
    let searchTimeslotPlace: RelatedPlaceRefOrValue;
    if (!item && this.selectedTimeSlotPlace) {
      this.populateFormAddress(this.selectedTimeSlotPlace);
      searchTimeslotPlace = this.selectedTimeSlotPlace;
    } else if (
      this.currentAppointment &&
      this.currentAppointment.relatedPlace
    ) {
      const currentAppointmentAddress = this.currentAppointment.relatedPlace;
      this.populateFormAddress(currentAppointmentAddress);
      searchTimeslotPlace = currentAppointmentAddress;
    } else if (item && item.subscribedProduct && item.subscribedProduct.place) {
      const entryInstallationAddress: TmaPlace = item.subscribedProduct.place.find(
        (address: TmaPlace) =>
          address.role === TmaPlaceRole.INSTALLATION_ADDRESS
      );
      if (entryInstallationAddress) {
        this.installationAddress = {
          buildingNumber: entryInstallationAddress.line1.split(',')[0],
          streetName: entryInstallationAddress.line1.split(',')[1],
          apartmentNumber: entryInstallationAddress.line2,
          city: entryInstallationAddress.town,
          country: entryInstallationAddress.country,
          region: entryInstallationAddress.region,
          postalCode: entryInstallationAddress.postalCode
        };
        searchTimeslotPlace = {
          streetName: entryInstallationAddress.line1,
          streetNr: entryInstallationAddress.line2,
          city: entryInstallationAddress.town,
          postcode: entryInstallationAddress.postalCode,
          country: entryInstallationAddress.country.isocode,
          stateOfProvince: entryInstallationAddress.region? entryInstallationAddress.region.isocode: undefined,
          role: INTERVENTION_ADDRESS,
          '@type': GEOGRAPHIC_ADDRESS
        };
      } else {
        return this.getSessionStorageAddress();
      }
    } else {
      return this.getSessionStorageAddress();
    }
    return searchTimeslotPlace;
  }

  private getSessionStorageAddress(): RelatedPlaceRefOrValue {
    let searchTimeslotPlace: RelatedPlaceRefOrValue;
    if (sessionStorage.getItem('Address')) {
      const sessionAddress: any = JSON.parse(sessionStorage.getItem('Address'));
      this.populateFormAddress(sessionAddress);

      searchTimeslotPlace = {
        streetNr: sessionAddress.streetName.split(',')[0],
        streetName: sessionAddress.streetName.split(',')[1],
        city: sessionAddress.city,
        postcode: sessionAddress.postcode,
        role: INTERVENTION_ADDRESS,
        '@type': GEOGRAPHIC_ADDRESS,
        country: sessionAddress.country,
        stateOfProvince: sessionAddress.stateOfProvince
      };
    }
    return searchTimeslotPlace;
  }

  private populateFormAddress(address: RelatedPlaceRefOrValue) {
    let country: Country;
    let region: Region;
    if (address) {
      country = {
        isocode: address.country
      };
      region = {
        isocode: address.stateOfProvince
      };
      this.installationAddress = {
        buildingNumber: address.streetName.split(',')[0],
        streetName: address.streetName.split(',')[1],
        apartmentNumber: address.streetNr,
        city: address.city,
        country: country,
        region: region,
        postalCode: address.postcode
      };
    }
  }
}
