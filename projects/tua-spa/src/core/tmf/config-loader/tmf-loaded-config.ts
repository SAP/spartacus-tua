/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
export interface TmfLoadedConfig {
  /**
   * Uid of the base site
   */
  baseSite?: string;

  /**
   * List of languages, where the first language is the default one
   */
  languages?: string[];

  /**
   * List of currencies, where the first currency is the default one
   */
  currencies?: string[];

  /**
   * Site context parameters to persist in the route
   */
  urlParameters?: string[];
}
