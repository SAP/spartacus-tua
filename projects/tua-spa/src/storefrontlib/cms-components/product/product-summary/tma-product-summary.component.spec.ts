/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nTestingModule } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { TmaProductSummaryComponent } from './tma-product-summary.component';
import { TmaProduct } from '../../../../core/model/tma-product.model';
import { AddToCartModule, CurrentProductService, ItemCounterModule, OutletDirective, ProductSummaryComponent } from '@spartacus/storefront';
import { TmaPriceModule } from '../price';

class MockCurrentProductService {
  getProduct(): Observable<TmaProduct> {
    return of();
  }
}

describe('TmaProductSummaryComponent in product', () => {
  let productSummaryComponent: TmaProductSummaryComponent;
  let fixture: ComponentFixture<TmaProductSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AddToCartModule, ItemCounterModule, I18nTestingModule, TmaPriceModule],
      declarations: [TmaProductSummaryComponent, ProductSummaryComponent, OutletDirective],
      providers: [
        { provide: CurrentProductService, useClass: MockCurrentProductService },
      ],
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
