import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  NO_ERRORS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { I18nTestingModule, BaseSiteService, Country, Region, Address, AddressValidation, UserAddressService } from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import {
  GeographicAddressService,
  QueryServiceQualificationService
} from '../../../../../core';
import { FormErrorsModule, ModalService } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { TmaAddressFormComponent } from '../../../address-form/tma-address-form.component';
import { JourneyChecklistInstallationAddressFormComponent } from './journey-checklist-installation-address-form.component';

const baseSite = 'test-site';

class MockGeographicAddressService {
  hasGeographicAddressError() {
  }

  clearCreatedGeographicAddressState() {
  }

  clearGeographicAddressError() {
  }
}

class MockFormerBuilder {
  group() {
  }
}

class MockBaseSiteService {
  getActive(): Observable<string> {
    return of(baseSite);
  }
}

class MockQueryServiceQualificationService {
  clearQueryServiceQualificationState() {
  }

  clearQueryServiceSearchResultState() {
  }

  clearQueryServiceQualificationErrorState() {
  }
}

@Component({
  selector: 'cx-address-form',
  template: '<p>Mock address form component</p>'
})
class MockTmaAddressFormComponent {
}

class MockModalService {
}

class MockUserAddressService {
  getDeliveryCountries(): Observable<Country[]> {
    return of();
  }

  loadDeliveryCountries(): void {}

  getRegions(): Observable<Region[]> {
    return of();
  }

  getAddresses(): Observable<Address[]> {
    return of([]);
  }
  verifyAddress(): Observable<AddressValidation> {
    return of({});
  }
}

describe('JourneyChecklistInstallationAddressFormComponent', () => {
  let component: JourneyChecklistInstallationAddressFormComponent;
  let fixture: ComponentFixture<JourneyChecklistInstallationAddressFormComponent>;
  let controls: FormGroup['controls'];
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JourneyChecklistInstallationAddressFormComponent,
        TmaAddressFormComponent
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        I18nTestingModule,
        NgbModule,
        FormErrorsModule,

        StoreModule.forRoot({})
      ],
      providers: [
        {
          provide: GeographicAddressService,
          useClass: MockGeographicAddressService
        },
        {
          provide: FormBuilder,
          useClass: MockFormerBuilder
        },
        {
          provide: BaseSiteService,
          useClass: MockBaseSiteService
        },
        {
          provide: QueryServiceQualificationService,
          useClass: MockQueryServiceQualificationService
        },
        {
          provide: ModalService,
          useClass: MockModalService
        },
        {
          provide: UserAddressService,
          useClass: MockUserAddressService
        }
      ]
    })
      .overrideComponent(JourneyChecklistInstallationAddressFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      JourneyChecklistInstallationAddressFormComponent
    );
    component = fixture.componentInstance;

    component.addressComponent.installationAddress = formBuilder.group({
      buildingNumber: '',
      streetName: '',
      apartmentNumber: '',
      city: '',
      country: null,
      region: null,
      postalCode: ''
    });

    component.installationAddressDetails = formBuilder.group({});
    JourneyChecklistInstallationAddressFormComponent.prototype.ngAfterViewInit = () => {
    };
    fixture.detectChanges();
    controls = component.installationAddressDetails.controls;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});