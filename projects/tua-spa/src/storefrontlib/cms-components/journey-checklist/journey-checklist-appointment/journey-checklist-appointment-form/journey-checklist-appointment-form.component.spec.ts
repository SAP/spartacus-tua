import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { JourneyChecklistAppointmentFormComponent } from './journey-checklist-appointment-form.component';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import {
  FormsModule,
  FormGroup,
  ControlContainer,
  ReactiveFormsModule
} from '@angular/forms';
import {
  I18nTestingModule,
  BaseSiteService,
  User,
  Cart,
  ConfigModule,
  provideConfig,
  CmsConfig
} from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import {
  TmaActiveCartService,
  TmaTmfCartService,
  JourneyChecklistConfig,
  defaultJourneyChecklistConfig
} from '../../../../../core';
import { AppointmentService } from '../../../../../core/appointment';
import { SearchTimeSlotService } from '../../../../../core/search-time-slot';
import { ModalService } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import createSpy = jasmine.createSpy;
import { UserAccountFacade, USER_ACCOUNT_CORE_FEATURE, USER_ACCOUNT_FEATURE } from '@spartacus/user/account/root';

describe('JourneyChecklistAppointmentFormComponent', () => {
  let component: JourneyChecklistAppointmentFormComponent;
  let fixture: ComponentFixture<JourneyChecklistAppointmentFormComponent>;
  let controls: FormGroup['controls'];
  const userId = 'testUserId';
  const cartCode = 'xxx';
  const baseSite = 'test-site';
  const customerId = '1234-5678-abcdef';

  const user: User = {
    uid: userId,
    customerId
  };

  const testCart: Cart = {
    code: cartCode,
    guid: 'testGuid',
    totalItems: 0,
    totalPrice: {
      currencyIso: 'USD',
      value: 0
    },
    totalPriceWithTax: {
      currencyIso: 'USD',
      value: 0
    }
  };

  class MockBaseSiteService {
    getActive(): Observable<string> {
      return of(baseSite);
    }
  }

  class TmaTmfMockCartService {
    cartId = 'cartId';
    userId = 'userId';
  }

  class MockUserAccountFacade {
    get = createSpy().and.returnValue(of(user));
  }

  class TmfMockAppointmentService {
    clearAppointmentState() {
    }

    clearCreatedAppointmentState() {
    }

    clearAppointmentError() {
    }
  }

  class MockTmaSearchTimeSlotService {
    setSelectedTimeSlot() {
    }

    getAvailableTimeSlots() {
      return of();
    }

    clearSearchTimeSlotState() {
    }

    clearSearchTimeSlotErrorState() {
    }
  }

  class MockModalService {
  }

  class MockActiveCartService {
    getActive(): Observable<Cart> {
      return of(testCart);
    }
  }

  class MockChangeDetectorRef {
  }

  const MockJourneyChecklistConfig: JourneyChecklistConfig = defaultJourneyChecklistConfig;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JourneyChecklistAppointmentFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        I18nTestingModule,
        NgbModule,
        ConfigModule,
        ReactiveFormsModule,
        StoreModule.forRoot({})
      ],
      providers: [
        { provide: TmaActiveCartService, useClass: MockActiveCartService },
        { provide: TmaTmfCartService, useClass: TmaTmfMockCartService },
        { provide: UserAccountFacade, useClass: MockUserAccountFacade },
        { provide: AppointmentService, useClass: TmfMockAppointmentService },
        { provide: BaseSiteService, useClass: MockBaseSiteService },
        {
          provide: SearchTimeSlotService,
          useClass: MockTmaSearchTimeSlotService
        },
        { provide: ModalService, useClass: MockModalService },
        {
          provide: ChangeDetectorRef,
          useClass: MockChangeDetectorRef
        },
        {
          provide: JourneyChecklistConfig,
          useValue: MockJourneyChecklistConfig
        },
        {
          provide: ControlContainer
        },
        provideConfig(<CmsConfig>{
          featureModules: {
            [USER_ACCOUNT_FEATURE]: {
              module: () =>
                import('@spartacus/user/account').then((m) => m.UserAccountModule),
            },
            [USER_ACCOUNT_CORE_FEATURE]: USER_ACCOUNT_FEATURE
          },
        }),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyChecklistAppointmentFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
    controls = component.appointmentAddressDetails.controls;
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
