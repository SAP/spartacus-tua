import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JourneyChecklistAppointmentComponent } from './journey-checklist-appointment.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  I18nTestingModule,
  UserService,
  BaseSiteService,
  CxDatePipe,
  User,
  Cart,
  ConfigModule,
} from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import {
  defaultJourneyChecklistConfig,
  JourneyChecklistConfig,
  TmaActiveCartService,
  TmaTmfCartService,
} from '../../../../core';
import { AppointmentService } from '../../../../core/appointment';
import { SearchTimeSlotService } from '../../../../core/search-time-slot';
import { ModalService } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import createSpy = jasmine.createSpy;

describe('TmaJourneyChecklistAppointmentComponent', () => {
  let component: JourneyChecklistAppointmentComponent;
  let fixture: ComponentFixture<JourneyChecklistAppointmentComponent>;
  const userId = 'testUserId';
  const cartCode = 'xxx';
  const baseSite = 'test-site';
  const customerId = '1234-5678-abcdef';

  const user: User = {
    uid: userId,
    customerId,
  };

  const testCart: Cart = {
    code: cartCode,
    guid: 'testGuid',
    totalItems: 0,
    totalPrice: {
      currencyIso: 'USD',
      value: 0,
    },
    totalPriceWithTax: {
      currencyIso: 'USD',
      value: 0,
    },
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

  class MockUserService {
    get = createSpy().and.returnValue(of(user));
  }

  class TmfMockAppointmentService {
    clearAppointmentState() {}
    clearCreatedAppointmentState() {}
    clearAppointmentError() {}
  }

  class MockTmaSearchTimeSlotService {
    setSelectedTimeSlot() {}
    getAvailableTimeSlots() {
      return of();
    }
  }

  class MockModalService {}

  class MockCxDatePipe {}

  class MockActiveCartService {
    getActive(): Observable<Cart> {
      return of(testCart);
    }
  }

  const MockJourneyChecklistConfig: JourneyChecklistConfig = defaultJourneyChecklistConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JourneyChecklistAppointmentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        I18nTestingModule,
        NgbModule,
        ConfigModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: TmaActiveCartService, useClass: MockActiveCartService },
        { provide: TmaTmfCartService, useClass: TmaTmfMockCartService },
        { provide: UserService, useClass: MockUserService },
        { provide: AppointmentService, useClass: TmfMockAppointmentService },
        { provide: BaseSiteService, useClass: MockBaseSiteService },
        {
          provide: SearchTimeSlotService,
          useClass: MockTmaSearchTimeSlotService,
        },
        { provide: ModalService, useClass: MockModalService },
        { provide: CxDatePipe, useClass: MockCxDatePipe },
        {
          provide: JourneyChecklistConfig,
          useValue: MockJourneyChecklistConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyChecklistAppointmentComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
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
