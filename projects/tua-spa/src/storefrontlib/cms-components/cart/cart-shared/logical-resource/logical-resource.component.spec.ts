import { TmaTmfRelatedPartyRole, TmaTmfRelatedParty } from '../../../../../core/model';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nTestingModule } from '@spartacus/core';
import { LogicalResourceComponent } from './logical-resource.component';
import { LogicalResourceReservationService } from '../../../../../core/reservation';

const userId = 'testUserId';
const relatedParty: TmaTmfRelatedParty = {
  id: userId,
  href: undefined,
  role: TmaTmfRelatedPartyRole.CUSTOMER,
  name: 'abc'
};

class TmaMockLogicalResourceReservationService {
  currentUser = relatedParty;

  setInitialReservationState() {
  }

  clearReservationError() {
  }

  clearReservationState() {
  }
}

describe('LogicalResourceComponent', () => {
  let component: LogicalResourceComponent;
  let fixture: ComponentFixture<LogicalResourceComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, I18nTestingModule],
      declarations: [LogicalResourceComponent],
      providers: [
        {
          provide: LogicalResourceReservationService,
          useClass: TmaMockLogicalResourceReservationService
        }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LogicalResourceComponent);
    component = fixture.componentInstance;
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
