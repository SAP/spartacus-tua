/*
 * SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company <deborah.cholmeley-jones@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Helper function for calculating default value for context parameter from config
 */
import { SiteContextConfig } from '@spartacus/core';

/**
 * Helper function for safely getting context parameter config
 */
export function getContextParameterValues(
  config: SiteContextConfig,
  parameter: string
): string[] {
  return (config.context && config.context[parameter]) || [];
}

export function getContextParameterDefault(
  config: SiteContextConfig,
  parameter: string
): string {
  const param = getContextParameterValues(config, parameter);
  return param && param.length ? param[0] : undefined;
}
