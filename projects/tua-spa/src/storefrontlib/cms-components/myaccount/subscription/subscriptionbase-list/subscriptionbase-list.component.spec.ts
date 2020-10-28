import {
  Component,
  DebugElement,
  Input,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SubscriptionBaseListComponent } from './subscriptionbase-list.component';
import { SubscriptionBaseService } from '../../../../../core/subscription/subscriptionbase/facade';
import {
  SubscriptionBase,
  SubscriptionBaseDetail,
} from '../../../../../core/model';
import { SubscriptionBaseDetailService } from '../../../../../core/subscription/subscriptionbase-detail/facade';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule, RoutingService } from '@spartacus/core';

@Component({
  selector: 'cx-tmf-product',
  template: '',
})
class MockSubscribedProductComponent {
  @Input()
  subscriptionBaseId: string;
}

const mockSubscriptionBases: SubscriptionBase[] = [
  {
    subscriberIdentity: 'tv_1',
    id: 'tv_1__IN',
  },
  {
    subscriberIdentity: 'internet_1',
    id: 'internet_1__IN',
  },
];

const mockSubscriptionBaseDetails: SubscriptionBaseDetail = {
  subscriptionBase: {
    id: '1040123444444',
  },
  user: {
    id: 'selfserviceuser4@hybris.com',
  },
};

class MockRoutingService {
  go() {}
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

describe('SubscriptionBaseListComponent', () => {
  let component: SubscriptionBaseListComponent;
  let fixture: ComponentFixture<SubscriptionBaseListComponent>;
  let mockSubscriptionBaseService: SubscriptionBaseService;
  let mockSubscriptionBaseDetailService: SubscriptionBaseDetailService;
  let el: DebugElement;

  beforeEach(async(() => {
    mockSubscriptionBaseService = <SubscriptionBaseService>{
      getListOfSubscriptionBases() {
        return of(mockSubscriptionBases);
      },
      clearSubscriptionBaseList() {},
    };
    mockSubscriptionBaseDetailService = <SubscriptionBaseDetailService>{
      getSubscriptionBaseDetails(subscriptionBaseId: string) {
        return of(mockSubscriptionBaseDetails);
      },
      clearSubscriptionBaseDetails() {},
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: SubscriptionBaseService,
          useValue: mockSubscriptionBaseService,
        },
        {
          provide: SubscriptionBaseDetailService,
          useValue: mockSubscriptionBaseDetailService,
        },
        { provide: RoutingService, useClass: MockRoutingService },
      ],
      declarations: [
        SubscriptionBaseListComponent,
        MockSubscribedProductComponent,
        MockUrlPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionBaseListComponent);
    el = fixture.debugElement;

    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  afterEach(() => {
    fixture.destroy();
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
