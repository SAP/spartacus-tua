import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { JourneyChecklistInstallationAddressComponent } from './journey-checklist-installation-address.component';
import {
  NO_ERRORS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { I18nTestingModule } from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { GeographicAddressService } from '../../../../core';
import { FormErrorsModule } from '@spartacus/storefront';

class MockGeographicAddressService {
  hasGeographicAddressError() {}
  clearCreatedGeographicAddressState() {}
  clearGeographicAddressError() {}
}

class MockFormerBuilder {
  group() {}
}

@Component({
  selector: 'cx-address-form',
  template: '<p>Mock address form component</p>',
})
class MockTmaAddressFormComponent {}

describe('JourneyChecklistInstallationAddressComponent', () => {
  let component: JourneyChecklistInstallationAddressComponent;
  let fixture: ComponentFixture<JourneyChecklistInstallationAddressComponent>;
  let controls: FormGroup['controls'];
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JourneyChecklistInstallationAddressComponent,
        MockTmaAddressFormComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        I18nTestingModule,
        NgbModule,
        FormErrorsModule,

        StoreModule.forRoot({}),
      ],
      providers: [
        {
          provide: GeographicAddressService,
          useClass: MockGeographicAddressService,
        },
        {
          provide: FormBuilder,
          useClass: MockFormerBuilder,
        },
      ],
    })
      .overrideComponent(JourneyChecklistInstallationAddressComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      JourneyChecklistInstallationAddressComponent
    );
    component = fixture.componentInstance;

    component.installationAddressDetails = formBuilder.group({});
    JourneyChecklistInstallationAddressComponent.prototype.ngAfterViewInit = () => {};
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
