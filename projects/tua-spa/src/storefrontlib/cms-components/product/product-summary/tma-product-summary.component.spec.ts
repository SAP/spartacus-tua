import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CmsService, CurrencyService, I18nTestingModule } from '@spartacus/core';
import {
  AddToCartModule,
  CurrentProductService,
  ItemCounterModule,
  ModalService,
  OutletDirective,
  ProductSummaryComponent,
  SpinnerModule
} from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { TmaBillingFrequencyConfig } from '../../../../core/config/billing-frequency/config';
import { TmaConsumptionConfig } from '../../../../core/config/consumption/config';
import { TmaProduct } from '../../../../core/model/tma-product.model';
import { TmaPriceService, TmaProductService } from '../../../../core/product/facade';
import { TmaPriceModule } from '../price';
import { TmaProductSummaryComponent } from './tma-product-summary.component';

class MockCurrentProductService {
  getProduct(): Observable<TmaProduct> {
    return of();
  }
}

class MockTmaPriceService {
}

class MockTmaProductSpecificationProductService {
}

class MockCmsService {
}

class MockModalService {
}

class MockCurrencyService {
}

class MockActivatedRoute {
}


describe('TmaProductSummaryComponent in product', () => {
  let productSummaryComponent: TmaProductSummaryComponent;
  let fixture: ComponentFixture<TmaProductSummaryComponent>;
  let mockConsumptionConfig: TmaConsumptionConfig;
  let mockBillingFrequencyConfig: TmaBillingFrequencyConfig;

  beforeEach(async(() => {
    mockConsumptionConfig = {
      consumption: {
        defaultValues: [
          { productSpecification: 'electricity', usageUnit: 'kwh', value: '1000' },
          { productSpecification: 'gas', usageUnit: 'cubic_meter', value: '1200' }
        ],
        default: '1000'
      }
    };

    mockBillingFrequencyConfig = {
      billingFrequency: [
        {
          key: 'yearly',
          value: 12
        }
      ]
    };

    TestBed.configureTestingModule({
      imports: [SpinnerModule, AddToCartModule, ItemCounterModule, I18nTestingModule, TmaPriceModule],
      declarations: [TmaProductSummaryComponent, ProductSummaryComponent, OutletDirective],
      providers: [
        {
          provide: CurrentProductService,
          useClass: MockCurrentProductService
        },
        {
          provide: TmaProductService,
          useClass: MockTmaProductSpecificationProductService
        },
        {
          provide: TmaPriceService,
          useClass: MockTmaPriceService
        },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: CmsService,
          useClass: MockCmsService
        },
        {
          provide: TmaConsumptionConfig,
          useValue: mockConsumptionConfig
        },
        {
          provide: ModalService,
          useClass: MockModalService
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService
        },
        {
          provide: TmaBillingFrequencyConfig,
          useValue: mockBillingFrequencyConfig
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmaProductSummaryComponent);
    productSummaryComponent = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(TmaProductSummaryComponent).toBeTruthy();
  });
});
