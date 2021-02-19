import {
  LogicalResourceReservationService,
  MsisdnReservationService,
} from '../../../../core/reservation';
import {
  TmaTmfRelatedParty,
  TmaTmfRelatedPartyRole,
} from '../../../../core/model';
import { of, Observable } from 'rxjs';
import {
  TmaTmfCartService,
  TmaActiveCartService,
  TmaChecklistAction,
  GeographicAddressService,
  SearchTimeSlotService,
} from '../../../../core';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  I18nTestingModule,
  User,
  UserService,
  BaseSiteService,
  AuthService,
  Cart,
  MultiCartService,
  ProductService,
  OCC_USER_ID_CURRENT,
  CxDatePipe,
  ConfigModule,
} from '@spartacus/core';
import createSpy = jasmine.createSpy;
import { AppointmentService } from '../../../../core/appointment/facade';
import { JourneyChecklistStepComponent } from './journey-checklist-step.component';

const userId = 'testUserId';
const cartCode = 'xxx';
const customerId = '1234-5678-ab';
const baseSite = 'test-site';

const checklist: TmaChecklistAction = {
  actionType: 'APPOINTMENT',
};
const checklistActions: TmaChecklistAction[] = [checklist];

const user: User = {
  uid: userId,
  customerId,
};
const relatedParty: TmaTmfRelatedParty = {
  id: userId,
  href: undefined,
  role: TmaTmfRelatedPartyRole.CUSTOMER,
  name: 'abc',
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

class AuthServiceStub {
  getOccUserId(): Observable<string> {
    return of(OCC_USER_ID_CURRENT);
  }

  isUserLoggedIn(): Observable<boolean> {
    return of(true);
  }
}

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

class MockAppointmentService {
  clearAppointmentState() {}

  clearCreatedAppointmentState() {}

  clearAppointmentError() {}
}

class MockMultiCartService {
  getCart = createSpy().and.returnValue(of(testCart));
  addEntry = createSpy();
  isStable = createSpy().and.returnValue(of(true));
}

class MockActiveCartService {
  getActive(): Observable<Cart> {
    return of(testCart);
  }
}

class MockMultiProductService {}

class MockGeographicAddressService {
  clearGeographicAddressError() {}
  clearCreatedGeographicAddressState() {}
}

class MockMsisdnReservationService {
  currentUser = relatedParty;

  setInitialReservationState() {}

  clearReservationError() {}
}

class MockLogicalResourceReservationService {
  currentUser = relatedParty;

  setInitialReservationState() {}

  clearReservationError() {}

  clearReservationState() {}

  clearCreatedReservationState() {}
}

class MockChangeDetectorRef {}

class MockSearchTimeSlotService {}

class MockCxDatePipe {}

describe('JourneyChecklistStepComponent', () => {
  let component: JourneyChecklistStepComponent;
  let fixture: ComponentFixture<JourneyChecklistStepComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JourneyChecklistStepComponent],
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
        { provide: AppointmentService, useClass: MockAppointmentService },
        {
          provide: LogicalResourceReservationService,
          useClass: MockLogicalResourceReservationService,
        },
        { provide: BaseSiteService, useClass: MockBaseSiteService },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: MultiCartService, useClass: MockMultiCartService },
        { provide: ProductService, useClass: MockMultiProductService },
        {
          provide: GeographicAddressService,
          useClass: MockGeographicAddressService,
        },
        {
          provide: MsisdnReservationService,
          useClass: MockMsisdnReservationService,
        },
        {
          provide: ChangeDetectorRef,
          useClass: MockChangeDetectorRef,
        },
        {
          provide: SearchTimeSlotService,
          useClass: MockSearchTimeSlotService,
        },
        { provide: CxDatePipe, useClass: MockCxDatePipe },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyChecklistStepComponent);
    component = fixture.componentInstance;
    component.checklistActions = checklistActions;
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
