import {
  TmaTmfRelatedPartyRole,
  TmaTmfRelatedParty,
  AppliedCapacityAmount,
  LogicalResourceReservationService,
  AvailabilityCheckService
} from '../../../../../core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { I18nTestingModule } from '@spartacus/core';
import { JourneyChecklistLogicalResourceDisplayComponent } from './journey-checklist-logical-resource-display.component';
import { Observable, of } from 'rxjs';
import { ModalService } from '@spartacus/storefront';

const userId = 'testUserId';
const relatedParty: TmaTmfRelatedParty = {
  id: userId,
  href: undefined,
  role: TmaTmfRelatedPartyRole.CUSTOMER,
  name: 'abc'
};

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

class TmaMockAvailabilityCheckService {
  getResourceCheckAvailability(): Observable<AppliedCapacityAmount[]> {
    return of(Array.of(mockLogicalResources));
  }
}

class TmaMockLogicalResourceReservationService {
  currentUser = relatedParty;

  setInitialReservationState() {
  }

  clearReservationError() {
  }

  clearReservationState() {
  }
}

class MockModalService {
}

describe('JourneyChecklistLogicalResourceDisplayComponent', () => {
  let component: JourneyChecklistLogicalResourceDisplayComponent;
  let fixture: ComponentFixture<JourneyChecklistLogicalResourceDisplayComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, I18nTestingModule],
      declarations: [JourneyChecklistLogicalResourceDisplayComponent],
      providers: [
        {
          provide: LogicalResourceReservationService,
          useClass: TmaMockLogicalResourceReservationService
        },
        {
          provide: AvailabilityCheckService,
          useClass: TmaMockAvailabilityCheckService
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
      JourneyChecklistLogicalResourceDisplayComponent
    );
    component = fixture.componentInstance;
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
