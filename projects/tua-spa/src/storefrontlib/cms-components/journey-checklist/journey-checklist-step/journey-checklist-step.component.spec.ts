import { of, Observable, ReplaySubject } from 'rxjs';
import { TmaTmfCartService, TmaActiveCartService } from '../../../../core';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  I18nTestingModule,
  User,
  UserService,
  BaseSiteService,
  OCC_USER_ID_CURRENT,
  AuthService,
  Cart,
  MultiCartService,
  UserToken,
} from '@spartacus/core';
import createSpy = jasmine.createSpy;
import { AppointmentService } from '../../../../core/appointment/facade';
import { JourneyChecklistStepComponent } from './journey-checklist-step.component';

const userId = 'testUserId';
const cartCode = 'xxx';
const customerId = '1234-5678-abcdef';
const baseSite = 'test-site';
const userToken$ = new ReplaySubject<UserToken>();

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

class AuthServiceStub {
  getUserToken(): Observable<UserToken> {
    return userToken$.asObservable();
  }
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
  clearAppointmentError(){}
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

describe('JourneyChecklistStepComponent', () => {
  let component: JourneyChecklistStepComponent;
  let fixture: ComponentFixture<JourneyChecklistStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JourneyChecklistStepComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        I18nTestingModule,
        NgbModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: TmaActiveCartService, useClass: MockActiveCartService },
        { provide: TmaTmfCartService, useClass: TmaTmfMockCartService },
        { provide: UserService, useClass: MockUserService },
        { provide: AppointmentService, useClass: MockAppointmentService },
        { provide: BaseSiteService, useClass: MockBaseSiteService },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: MultiCartService, useClass: MockMultiCartService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyChecklistStepComponent);
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
