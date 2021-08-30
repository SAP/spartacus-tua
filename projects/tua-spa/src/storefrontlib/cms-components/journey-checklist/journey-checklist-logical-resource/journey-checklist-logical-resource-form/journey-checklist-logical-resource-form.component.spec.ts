import { Observable, of, ReplaySubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import {
  I18nTestingModule,
  MultiCartService,
  Cart,
  UserService,
  User,
  AuthService,
  OCC_USER_ID_CURRENT,
  BaseSiteService,
  AuthToken
} from '@spartacus/core';
import createSpy = jasmine.createSpy;
import {
  defaultJourneyChecklistConfig,
  JourneyChecklistConfig,
  TmaActiveCartService,
  TmaTmfRelatedParty
} from '../../../../../core';
import {
  LogicalResourceReservationService,
  MsisdnReservationService
} from '../../../../../core/reservation/facade';
import {
  AppliedCapacityAmount,
  TmaTmfRelatedPartyRole
} from '../../../../../core/model';
import { AvailabilityCheckService } from '../../../../../core/availability-check/facade';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { JourneyChecklistLogicalResourceFormComponent } from './journey-checklist-logical-resource-form.component';
import { ModalService } from '@spartacus/storefront';

const cartCode = 'xxx';
const userId = 'testUserId';
const customerId = '1234-5678-abcdef';
const baseSite = 'test-site';
const userToken$ = new ReplaySubject<AuthToken>();
const testError = 'test error';

const mockLogicalResources: AppliedCapacityAmount = {
  appliedCapacityAmount: 6,
  type: 'phone number',
  resource: [
    {
      id: 'PN_000000005',
      value: '07467339811',
      referredType: 'phone number'
    }
  ]
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

const relatedParty: TmaTmfRelatedParty = {
  id: userId,
  href: undefined,
  role: TmaTmfRelatedPartyRole.CUSTOMER,
  name: 'abc'
};

const user: User = {
  uid: userId,
  customerId
};

class MockAvailabilityCheckService {
  getResourceCheckAvailability(): Observable<AppliedCapacityAmount[]> {
    return of(Array.of(mockLogicalResources));
  }

  getAvailabilityCheckError(): Observable<string> {
    return of(testError);
  }

  setSelectedLogicalResource() {
  }

  clearAvailabilityCheckState() {
  }

  clearAvailabilityCheckError() {
  }
}

class MockMultiCartService {
  getCart = createSpy().and.returnValue(of(testCart));
  addEntry = createSpy();
  removeEntry = createSpy();
  isStable = createSpy().and.returnValue(of(true));
}

class MockActiveCartService {
  getActive(): Observable<Cart> {
    return of(testCart);
  }
}

class TmaMockLogicalResourceReservationService {
  currentUser = relatedParty;

  setInitialReservationState() {
  }

  clearReservationError() {
  }

  clearUpdateReservationError() {
  }

  clearReservationState() {
  }

  clearCreatedReservationState() {
  }
}

class MockMsisdnReservationService {
}

class MockUserService {
  get = createSpy().and.returnValue(of(user));
}

class MockBaseSiteService {
  getActive(): Observable<string> {
    return of(baseSite);
  }
}

const MockJourneyChecklistConfig: JourneyChecklistConfig = defaultJourneyChecklistConfig;

class AuthServiceStub {
  getUserToken(): Observable<AuthToken> {
    return userToken$.asObservable();
  }

  getOccUserId(): Observable<string> {
    return of(OCC_USER_ID_CURRENT);
  }

  isUserLoggedIn(): Observable<boolean> {
    return of(true);
  }
}

class MockModalService {
}

describe('JourneyChecklistLogicalResourceFormComponent', () => {
  let component: JourneyChecklistLogicalResourceFormComponent;
  let fixture: ComponentFixture<JourneyChecklistLogicalResourceFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JourneyChecklistLogicalResourceFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, I18nTestingModule, StoreModule.forRoot({})],
      providers: [
        {
          provide: AvailabilityCheckService,
          useClass: MockAvailabilityCheckService
        },
        { provide: MultiCartService, useClass: MockMultiCartService },
        { provide: TmaActiveCartService, useClass: MockActiveCartService },
        {
          provide: LogicalResourceReservationService,
          useClass: TmaMockLogicalResourceReservationService
        },
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: BaseSiteService, useClass: MockBaseSiteService },
        {
          provide: JourneyChecklistConfig,
          useValue: MockJourneyChecklistConfig
        },
        {
          provide: MsisdnReservationService,
          useClass: MockMsisdnReservationService
        },
        {
          provide: ModalService,
          useClass: MockModalService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      JourneyChecklistLogicalResourceFormComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
