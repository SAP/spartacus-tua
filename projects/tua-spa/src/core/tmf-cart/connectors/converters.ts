/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmaTmfShoppingCart } from '../../model';
import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';

export const TMA_TMF_CART_NORMALIZER = new InjectionToken<Converter<any, TmaTmfShoppingCart>>('TmaTmfCartNormalizer');
