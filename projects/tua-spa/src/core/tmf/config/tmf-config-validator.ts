/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { TmfConfig } from './tmf-config';

export function tmfConfigValidator(config: TmfConfig) {
  if (
    config.backend === undefined ||
    config.backend.tmf === undefined ||
    config.backend.tmf.baseUrl === undefined
  ) {
    return 'Please configure backend.tmf.baseUrl before using storefront library!';
  }
}
