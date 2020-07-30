/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TestBed } from '@angular/core/testing';

import { TuaSpaService } from './tua-spa.service';

describe('TuaSpaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TuaSpaService = TestBed.get(TuaSpaService);
    expect(service).toBeTruthy();
  });
});
